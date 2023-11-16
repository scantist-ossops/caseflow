/* eslint-disable max-lines */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { resetJumpToPage, setDocScrollPosition } from '../reader/PdfViewer/PdfViewerActions';
import StatusMessage from '../components/StatusMessage';
import { PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT, ANNOTATION_ICON_SIDE_LENGTH, PAGE_DIMENSION_SCALE, PAGE_MARGIN
} from './constants';
import { setPdfDocument, clearPdfDocument, onScrollToComment, setDocumentLoadError, clearDocumentLoadError,
  setPageDimensions } from '../reader/Pdf/PdfActions';
import { updateSearchIndexPage, updateSearchRelativeIndex } from '../reader/PdfSearch/PdfSearchActions';
import ApiUtil from '../util/ApiUtil';
import PdfPage from './PdfPage';
import * as PDFJS from 'pdfjs-dist';
import { Grid, AutoSizer } from 'react-virtualized';
import { isUserEditingText, pageIndexOfPageNumber, pageNumberOfPageIndex, rotateCoordinates } from './utils';
import { startPlacingAnnotation, showPlaceAnnotationIcon
} from '../reader/AnnotationLayer/AnnotationActions';
import { INTERACTION_TYPES } from '../reader/analytics';
import { getCurrentMatchIndex, getMatchesPerPageInFile, getSearchTerm } from './selectors';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import uuid from 'uuid';
import { storeMetrics, recordAsyncMetrics } from '../util/Metrics';

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const CorrespondencePdfFile = ({
  documentId,
  documentType,
  featureToggles,
  file,
  setPdfDocument,
  setDocumentLoadError,
  setPageDimensions,
  clearDocumentLoadError,
  clearPdfDocument,
  pdfDocument,
  isVisible,
  scale,
  pageDimensions,
  rotation,
  jumpToPageNumber,
  resetJumpToPage,
  scrollToComment,
  onScrollToComment,
  scrollTop,
  setDocScrollPosition,
  currentMatchIndex,
  matchesPerPage,
  searchText,
  updateSearchRelativeIndex,
  updateSearchIndexPage,
  onPageChange,
  loadError,
  windowingOverscan,
  ...props
}) => {
  let loadingTask = null;
  let pdfDocument = null;
  let grid = null;
  let scrollTop = 0;
  let scrollLeft = 0;
  let scrollLocation = {};
  let clientHeight = 0;
  let clientWidth = 0;
  let currentPage = 0;
  let columnCount = 1;

  const getDocument = (requestOptions) => {
    const logId = uuid.v4();

    const documentData = {
      documentId: documentId,
      documentType: documentType,
      file: file,
      prefetchDisabled: featureToggles.prefetchDisabled
    };

    return ApiUtil.get(file, requestOptions).
      then((resp) => {
        const metricData = {
          message: `Getting PDF document: "${file}"`,
          type: 'performance',
          product: 'reader',
          data: documentData,
        };

        /* The feature toggle reader_get_document_logging adds the progress of the file being loaded in console */
        if (featureToggles.readerGetDocumentLogging) {
          const src = {
            data: resp.body,
            verbosity: 5,
            stopAtErrors: false,
            pdfBug: true,
          };

          this.loadingTask = PDFJS.getDocument(src);

          this.loadingTask.onProgress = (progress) => {
            // eslint-disable-next-line no-console
            console.log(`UUID: ${logId} : Progress of ${file}: ${progress.loaded} / ${progress.total}`);
          };
        } else {
          this.loadingTask = PDFJS.getDocument({ data: resp.body });
        }

        return recordAsyncMetrics(this.loadingTask.promise, metricData,
          featureToggles.metricsRecordPDFJSGetDocument);

      }, (reason) => this.onRejected(reason, 'getDocument')).
      then((pdfDocument) => {
        this.pdfDocument = pdfDocument;

        return this.getPages(pdfDocument);
      }, (reason) => this.onRejected(reason, 'getPages')).
      then((pages) => this.setPageDimensions(pages)
        , (reason) => this.onRejected(reason, 'setPageDimensions')).
      then(() => {
        if (this.loadingTask.destroyed) {
          return this.pdfDocument.destroy();
        }
        this.loadingTask = null;

        return setPdfDocument(file, this.pdfDocument);
      }, (reason) => this.onRejected(reason, 'setPdfDocument')).
      catch((error) => {
        const message = `UUID: ${logId} : Getting PDF document failed for ${file} : ${error}`;

        console.error(message);

        if (featureToggles.metricsRecordPDFJSGetDocument) {
          storeMetrics(
            logId,
            documentData,
            { message,
              type: 'error',
              product: 'browser',
              prefetchDisabled: featureToggles.prefetchDisabled
            }
          );
        }

        this.loadingTask = null;
        setDocumentLoadError(file);
      });
  }

  const onRejected = (reason, step) => {
    const documentId = documentId,
      documentType = documentType,
      file = file,
      logId = uuid.v4();

    console.error(`${logId} : GET ${file} : STEP ${step} : ${reason}`);

    if (featureToggles.metricsRecordPDFJSGetDocument) {
      const documentData = {
        documentId,
        documentType,
        file,
        step,
        reason,
        prefetchDisabled: featureToggles.prefetchDisabled
      };

      storeMetrics(logId, documentData, {
        message: `Getting PDF document: "${file}"`,
        type: 'error',
        product: 'reader'
      });
    }

    throw reason;
  }

  const getPages = (pdfDocument) => {
    const promises = _.range(0, pdfDocument?.numPages).map((index) => {

      return pdfDocument.getPage(pageNumberOfPageIndex(index));
    });

    return Promise.all(promises);
  }

  const getViewportAndSetPageDimensions = (pages) => {
    const viewports = pages.map((page) => {
      return _.pick(page.getViewport({ scale: PAGE_DIMENSION_SCALE }), ['width', 'height']);
    });

    setPageDimensions(file, viewports);
  }

  componentDidMount = () => {

    let requestOptions = {
      cache: true,
      withCredentials: true,
      timeout: true,
      responseType: 'arraybuffer',
    };

    window.addEventListener('keydown', this.keyListener);

    clearDocumentLoadError(file);

    return this.getDocument(requestOptions);
  }

  /**
   * We have to set withCredentials to true since we're requesting the file from a
   * different domain (eFolder), and still need to pass our credentials to authenticate.
   */


  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.keyListener);

    if (this.loadingTask) {
      this.loadingTask.destroy();
    }
    if (this.pdfDocument) {
      this.pdfDocument.destroy();
      clearPdfDocument(file, this.pdfDocument);
    }
  }

  getPage = ({ rowIndex, columnIndex, style, isVisible }) => {
    const pageIndex = (this.columnCount * rowIndex) + columnIndex;

    if (pageIndex >= pdfDocument.numPages) {
      return <div key={(this.columnCount * rowIndex) + columnIndex} style={style} />;
    }

    return <div key={pageIndex} style={style}>
      <PdfPage
        documentId={documentId}
        file={file}
        isPageVisible={isVisible}
        pageIndex={(rowIndex * this.columnCount) + columnIndex}
        isFileVisible={isVisible}
        scale={scale}
        pdfDocument={pdfDocument}
        featureToggles={featureToggles}
      />
    </div>;
  }

  pageDimensions = (index) => _.get(pageDimensions, [file, index])

  isHorizontal = () => rotation === 90 || rotation === 270;

  pageHeight = (index) => {
    if (this.isHorizontal()) {
      return _.get(this.pageDimensions(index), ['width'], PDF_PAGE_WIDTH);
    }

    return _.get(this.pageDimensions(index), ['height'], PDF_PAGE_HEIGHT);
  }

  pageWidth = (index) => {
    if (this.isHorizontal()) {
      return _.get(this.pageDimensions(index), ['height'], PDF_PAGE_HEIGHT);
    }

    return _.get(this.pageDimensions(index), ['width'], PDF_PAGE_WIDTH);
  }

  getRowHeight = ({ index }) => {
    const pageIndexStart = index * this.columnCount;
    const pageHeights = _.range(pageIndexStart, pageIndexStart + this.columnCount).
      map((pageIndex) => this.pageHeight(pageIndex));

    return (Math.max(...pageHeights) + PAGE_MARGIN) * scale;
  }

  getColumnWidth = () => {
    const maxPageWidth = _.range(0, pdfDocument.numPages).
      reduce((maxWidth, pageIndex) => Math.max(this.pageWidth(pageIndex), maxWidth), 0);

    return (maxPageWidth + PAGE_MARGIN) * scale;
  }

  getGrid = (grid) => {
    this.grid = grid;

    if (this.grid) {
      this.grid.recomputeGridSize();
    }
  }

  pageRowAndColumn = (pageIndex) => ({
    rowIndex: Math.floor(pageIndex / this.columnCount),
    columnIndex: pageIndex % this.columnCount
  })

  getOffsetForPageIndex = (pageIndex, alignment = 'start') => this.grid.getOffsetForCell({
    alignment,
    ...this.pageRowAndColumn(pageIndex)
  })

  scrollToPosition = (pageIndex, locationOnPage = 0) => {
    const position = this.getOffsetForPageIndex(pageIndex);

    this.grid.scrollToPosition({
      scrollLeft: position.scrollLeft,
      scrollTop: Math.max(position.scrollTop + locationOnPage, 0)
    });
  }

  jumpToPage = () => {
    // We want to jump to the page, after the react virtualized has initialized the scroll window.
    if (jumpToPageNumber && this.clientHeight > 0) {
      const scrollToIndex = jumpToPageNumber ? pageIndexOfPageNumber(jumpToPageNumber) : -1;

      this.grid.scrollToCell(this.pageRowAndColumn(scrollToIndex));
      resetJumpToPage();
    }
  }

  jumpToComment = () => {
    // We want to jump to the comment, after the react virtualized has initialized the scroll window.
    if (scrollToComment && this.clientHeight > 0) {
      const pageIndex = pageIndexOfPageNumber(scrollToComment.page);
      const transformedY = rotateCoordinates(scrollToComment,
        this.pageDimensions(pageIndex), - rotation).y * scale;
      const scrollToY = (transformedY - (this.pageHeight(pageIndex) / 2)) / scale;

      this.scrollToPosition(pageIndex, scrollToY);
      onScrollToComment(null);
    }
  }

  scrollWhenFinishedZooming = () => {
    if (this.scrollLocation.page) {
      this.scrollToPosition(this.scrollLocation.page, this.scrollLocation.locationOnPage);
      this.scrollLocation = {};
    }
  }

  scrollToScrollTop = (pageIndex, locationOnPage = scrollTop) => {
    this.scrollToPosition(pageIndex, locationOnPage);
    setDocScrollPosition(null);
  }

  getPageIndexofMatch = (matchIndex = currentMatchIndex) => {
    // get page, relative index of match at absolute index
    let cumulativeMatches = 0;

    for (let matchesPerPageIndex = 0; matchesPerPageIndex < matchesPerPage.length; matchesPerPageIndex++) {
      if (matchIndex < cumulativeMatches + matchesPerPage[matchesPerPageIndex].matches) {
        return {
          pageIndex: matchesPerPage[matchesPerPageIndex].pageIndex,
          relativeIndex: matchIndex - cumulativeMatches
        };
      }

      cumulativeMatches += matchesPerPage[matchesPerPageIndex].matches;
    }

    return {
      pageIndex: -1,
      relativeIndex: -1
    };
  }

  scrollToSearchTerm = (prevProps) => {
    const { pageIndex, relativeIndex } = this.getPageIndexofMatch();

    if (pageIndex === -1) {
      return;
    }

    const currentMatchChanged = currentMatchIndex !== prevProps.currentMatchIndex;
    const searchTextChanged = searchText !== prevProps.searchText;

    if (scrollTop !== null && scrollTop !== prevProps.scrollTop) {
      // after currentMatchIndex is updated, scrollTop gets set in PdfPage, and this gets called again
      this.scrollToScrollTop(pageIndex);
    } else if (currentMatchChanged || searchTextChanged) {
      updateSearchRelativeIndex(relativeIndex);
      updateSearchIndexPage(pageIndex);

      // if the page has been scrolled out of DOM, scroll back to it, setting scrollTop
      this.grid.scrollToCell(this.pageRowAndColumn(pageIndex));
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.isVisible !== isVisible) {
      this.currentPage = 0;
    }

    if (this.grid && prevProps.scale !== scale) {
      // Set the scroll location based on the current page and where you
      // are on that page scaled by the zoom factor.
      const zoomFactor = scale / prevProps.scale;
      const nonZoomedLocation = (this.scrollTop - this.getOffsetForPageIndex(this.currentPage).scrollTop);

      this.scrollLocation = {
        page: this.currentPage,
        locationOnPage: nonZoomedLocation * zoomFactor
      };
    }

    if (this.grid && isVisible) {
      if (!prevProps.isVisible) {
        // eslint-disable-next-line react/no-find-dom-node
        const domNode = ReactDOM.findDOMNode(this.grid);

        // We focus the DOM node whenever a user presses up or down, so that they scroll the pdf viewer.
        // The ref in this.grid is not an actual DOM node, so we can't call focus on it directly. findDOMNode
        // might be deprecated at some point in the future, but until then this seems like the best we can do.
        domNode.focus();
      }

      this.grid.recomputeGridSize();

      this.scrollWhenFinishedZooming();
      this.jumpToPage();
      this.jumpToComment();

      if (searchText && matchesPerPage.length) {
        this.scrollToSearchTerm(prevProps);
      }
    }
  }

  onPageChange = (index, clientHeight) => {
    this.currentPage = index;
    onPageChange(pageNumberOfPageIndex(index), clientHeight / this.pageHeight(index));
  }

  onScroll = ({ clientHeight, scrollTop, scrollLeft }) => {
    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;

    if (this.grid) {
      let minIndex = 0;
      let minDistance = Infinity;

      _.range(0, pdfDocument.numPages).forEach((index) => {
        const offset = this.getOffsetForPageIndex(index, 'center');
        const distance = Math.abs(offset.scrollTop - scrollTop);

        if (distance < minDistance) {
          minIndex = index;
          minDistance = distance;
        }
      });

      this.onPageChange(minIndex, clientHeight);
    }
  }

  getCenterOfVisiblePage = (scrollWindowBoundary, pageScrollBoundary, pageDimension, clientDimension) => {
    const scrolledLocationOnPage = (scrollWindowBoundary - pageScrollBoundary) / scale;
    const adjustedScrolledLocationOnPage = scrolledLocationOnPage ? scrolledLocationOnPage : scrolledLocationOnPage / 2;

    const positionBasedOnPageDimension = (pageDimension + scrolledLocationOnPage - ANNOTATION_ICON_SIDE_LENGTH) / 2;
    const positionBasedOnClientDimension = adjustedScrolledLocationOnPage +
      (((clientDimension / scale) - ANNOTATION_ICON_SIDE_LENGTH) / 2);

    return Math.min(positionBasedOnPageDimension, positionBasedOnClientDimension);
  }

  handlePageUpDown = (event) => {
    if (this.grid && (event.code === 'PageDown' || event.code === 'PageUp')) {
      const { rowIndex, columnIndex } = this.pageRowAndColumn(this.currentPage);

      this.grid.scrollToCell({
        rowIndex: Math.max(0, rowIndex + (event.code === 'PageDown' ? 1 : -1)),
        columnIndex
      });

      event.preventDefault();
    }
  }

  keyListener = (event) => {
    if (isUserEditingText() || !isVisible) {
      return;
    }

    this.handlePageUpDown(event);

    if (event.altKey) {
      if (event.code === 'KeyC') {
        this.handleAltC();
      }
    }
  }

  displayErrorMessage = () => {
    if (!isVisible) {
      return;
    }

    const downloadUrl = `${file}?type=${documentType}&download=true`;

    // Center the status message vertically
    const style = {
      position: 'absolute',
      top: '40%',
      left: '50%',
      width: `${PDF_PAGE_WIDTH}px`,
      transform: 'translate(-50%, -50%)'
    };

    return <div style={style}>
      <StatusMessage title="Unable to load document" type="warning">
          Caseflow is experiencing technical difficulties and cannot load <strong>{documentType}</strong>.
        <br />
          You can try <a href={downloadUrl}>downloading the document</a> or try again later.
      </StatusMessage>
    </div>;
  }

  overscanIndicesGetter = ({ cellCount, overscanCellsCount, startIndex, stopIndex }) => ({
    overscanStartIndex: Math.max(0, startIndex - Math.ceil(overscanCellsCount / 2)),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + Math.ceil(overscanCellsCount / 2))
  })

  render() {
    if (loadError) {
      return <div>{this.displayErrorMessage()}</div>;
    }

    // Consider the following scenario: A user loads PDF 1, they then move to PDF 3 and
    // PDF 1 is unloaded, the pdfDocument object is cleaned up. However, before the Redux
    // state is nulled out the user moves back to PDF 1. We still can access the old destroyed
    // pdfDocument in the Redux state. So we must check that the transport is not destroyed
    // before trying to render the page.
    // eslint-disable-next-line no-underscore-dangle
    if (pdfDocument && !pdfDocument._transport.destroyed) {
      return <AutoSizer>{
        ({ width, height }) => {
          if (this.clientHeight !== height) {
            _.defer(this.onPageChange, this.currentPage, height);
            this.clientHeight = height;
          }
          if (this.clientWidth !== width) {
            this.clientWidth = width;
          }

          this.columnCount = Math.min(Math.max(Math.floor(width / this.getColumnWidth()), 1),
            pdfDocument.numPages);

          let visibility = isVisible ? 'visible' : 'hidden';

          return <Grid
            ref={this.getGrid}
            containerStyle={{
              visibility: `${visibility}`,
              margin: '0 auto',
              marginBottom: `-${PAGE_MARGIN}px`
            }}
            overscanIndicesGetter={this.overscanIndicesGetter}
            estimatedRowSize={
              (this.pageHeight(0) + PAGE_MARGIN) * scale
            }
            overscanRowCount={Math.floor(windowingOverscan / this.columnCount)}
            onScroll={this.onScroll}
            height={height}
            rowCount={Math.ceil(pdfDocument.numPages / this.columnCount)}
            rowHeight={this.getRowHeight}
            cellRenderer={this.getPage}
            scrollToAlignment="start"
            width={width}
            columnWidth={this.getColumnWidth}
            columnCount={this.columnCount}
            scale={scale}
            tabIndex={isVisible ? 0 : -1}
          />;
        }
      }
      </AutoSizer>;
    }

    return null;
  }
}

CorrespondencePdfFile.propTypes = {
  _transport: PropTypes.object,
  clearDocumentLoadError: PropTypes.object,
  clearPdfDocument: PropTypes.object,
  currentMatchIndex: PropTypes.object,
  documentId: PropTypes.number.isRequired,
  documentType: PropTypes.string,
  file: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  jumpToPageNumber: PropTypes.number,
  loadError: PropTypes.bool,
  matchesPerPage: PropTypes.array,
  onPageChange: PropTypes.func,
  onScrollToComment: PropTypes.func,
  pageDimensions: PropTypes.func,
  pdfDocument: PropTypes.object,
  resetJumpToPage: PropTypes.func,
  rotation: PropTypes.number,
  scale: PropTypes.number,
  scrollToComment: PropTypes.shape({
    id: PropTypes.number,
    page: PropTypes.number
  }),
  scrollTop: PropTypes.number,
  searchText: PropTypes.string,
  setDocumentLoadError: PropTypes.func,
  setDocScrollPosition: PropTypes.func,
  setPageDimensions: PropTypes.func,
  setPdfDocument: PropTypes.func,
  showPlaceAnnotationIcon: PropTypes.func,
  sidebarHidden: PropTypes.bool,
  startPlacingAnnotation: PropTypes.func,
  togglePdfSidebar: PropTypes.func,
  updateSearchIndexPage: PropTypes.func,
  updateSearchRelativeIndex: PropTypes.func,
  windowingOverscan: PropTypes.number,
  featureToggles: PropTypes.object
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPdfDocument,
    clearPdfDocument,
    resetJumpToPage,
    onScrollToComment,
    startPlacingAnnotation,
    showPlaceAnnotationIcon,
    setDocumentLoadError,
    clearDocumentLoadError,
    setDocScrollPosition,
    updateSearchIndexPage,
    updateSearchRelativeIndex,
    setPageDimensions
  }, dispatch)
});

const mapStateToProps = (state, props) => {
  return {
    currentMatchIndex: getCurrentMatchIndex(state, props),
    matchesPerPage: getMatchesPerPageInFile(state, props),
    searchText: getSearchTerm(state, props),
    ..._.pick(state.pdfViewer, 'jumpToPageNumber', 'scrollTop'),
    ..._.pick(state.pdf, 'pageDimensions', 'scrollToComment'),
    loadError: state.pdf.documentErrors[props.file],
    pdfDocument: state.pdf.pdfDocuments[props.file],
    windowingOverscan: state.pdfViewer.windowingOverscan,
    rotation: _.get(state.documents, [props.documentId, 'rotation'])
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondencePdfFile);
