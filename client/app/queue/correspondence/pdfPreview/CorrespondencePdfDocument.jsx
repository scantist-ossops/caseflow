import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ApiUtil from '../../../util/ApiUtil';
import classNames from 'classnames';
import { css } from 'glamor';
import { PDF_PAGE_HEIGHT, PDF_PAGE_WIDTH, SEARCH_BAR_HEIGHT, PAGE_DIMENSION_SCALE, PAGE_MARGIN } from '../../../reader/constants';
import _, { get } from 'lodash';
import { AutoSizer, Grid } from 'react-virtualized';
import { pageNumberOfPageIndex } from '../../../reader/utils';
import uuid, { v4 as uuidv4 } from 'uuid';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const CorrespondencePdfDocument = (props) => {
  const {
    scale
  } = props;

  const canvasRefs = useRef([]);
  const gridRef = useRef(null);
  const clientHeight = useRef(0);
  const clientWidth = useRef(0);
  const columnCount = useRef(1);
  const [pdfPageProxies, setPdfPageProxies] = useState(null);
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  console.log(canvasRefs)
  useEffect(() => {
    const loadPdf = async () => {

      const response = await ApiUtil.get('/document/13/pdf', {
        cache: true,
        withCredentials: true,
        timeout: true,
        responseType: 'arraybuffer',
      });

      const loadingTask = pdfjs.getDocument({ data: response.body });
      const pdfDocument = await loadingTask.promise;

      const pages = await getAllPages(pdfDocument);

      setPdfPageProxies(pages);
    };

    loadPdf();
  }, []);

  useEffect(() => {
    if (pdfPageProxies) {
      setIsDoneLoading(true);
    }
  }, [pdfPageProxies]);

  useEffect(() => {
    console.log(scale);
  }, [scale]);

  // const getGridPage = ({ rowIndex, columnIndex, style, isVisible }) => {
  //   const pageIndex = (columnCount.current * rowIndex) + columnIndex;

  //   if (pageIndex >= this.props.pdfDocument.numPages) {
  //     return <div key={(columnCount.current * rowIndex) + columnIndex} style={style} />;
  //   }

  //   return <div key={pageIndex} style={style}>
  //     <CorrespondencePdfPage2
  //       // documentId={this.props.documentId}
  //       // file={this.props.file}
  //       // isPageVisible={isVisible}
  //       // pageIndex={(rowIndex * columnCount) + columnIndex}
  //       // isFileVisible={this.props.isVisible}
  //       // scale={this.props.scale}
  //       // pdfDocument={this.props.pdfDocument}
  //       // featureToggles={this.props.featureToggles}
  //     />
  //   </div>;
  // };

  const getAllPages = (pdfDocument) => {
    const promises = _.range(0, pdfDocument?.numPages).map((index) => {

      return pdfDocument.getPage(pageNumberOfPageIndex(index));
    });

    return Promise.all(promises);
  };

  const generatePdfPages = pdfPageProxies?.map((page, index) => {
    return (
      <CorrespondencePdfPage2
        key={uuidv4()}
        uuid={uuidv4()}
        index={index}
        canvasRefs={canvasRefs}
        page={page}
        scale={scale}
      />
    );
  });

  const renderPdfPages = useMemo(() =>
    pdfPageProxies?.map((page, index) => {
      return (
        <CorrespondencePdfPage2
          key={uuidv4()}
          uuid={uuidv4()}
          index={index}
          canvasRefs={canvasRefs}
          page={page}
          scale={scale}
        />
      );
    })
  , [pdfPageProxies]);

  return (
    <>
      { isDoneLoading ? renderPdfPages : <div>Is Loading</div> }
    </>
  );

  // return (
  //   <AutoSizer>{
  //     ({ width, height }) => {
  //       if (clientHeight.current !== height) {
  //         _.defer(this.onPageChange, this.currentPage, height);
  //         clientHeight.current = height;
  //       }
  //       if (clientWidth !== width) {
  //         clientWidth.current = width;
  //       }

  //       columnCount.current = Math.min(Math.max(Math.floor(width / this.getColumnWidth()), 1),
  //         this.props.pdfDocument.numPages);

  //       let visibility = this.props.isVisible ? 'visible' : 'hidden';

  //       return <Grid
  //         ref={gridRef}
  //         containerStyle={{
  //           visibility: `${visibility}`,
  //           margin: '0 auto',
  //           marginBottom: `-${PAGE_MARGIN}px`
  //         }}
  //         estimatedRowSize={
  //           (this.pageHeight(0) + PAGE_MARGIN) * this.props.scale
  //         }
  //         overscanRowCount={Math.floor(this.props.windowingOverscan / columnCount)}
  //         onScroll={this.onScroll}
  //         height={height}
  //         rowCount={Math.ceil(this.props.pdfDocument.numPages / columnCount)}
  //         rowHeight={this.getRowHeight}
  //         cellRenderer={getPage}
  //         scrollToAlignment="start"
  //         width={width}
  //         columnWidth={this.getColumnWidth}
  //         columnCount={columnCount}
  //         scale={scale}
  //         tabIndex={this.props.isVisible ? 0 : -1}
  //       />;
  //     }
  //   }
  //   </AutoSizer>
  // );
};

const CorrespondencePdfPage2 = (props) => {
  const { page, scale, uuid, canvasRefs, index } = props;

  useEffect(() => {
    const canvas = document.getElementById(uuid);
    console.log(canvas)
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderOptions = {
      canvasContext: context,
      viewport,
    };

    page.render(renderOptions);

  }, []);

  return (
    <canvas id={uuid} ref={(ref) => (canvasRefs.current[index] = ref)} />
  )

  // console.log(props.pdfPageProxy)
  // const containerRef = useRef(null);

  // const pageClassNames = classNames({
  //   'cf-pdf-pdfjs-container': true,
  //   page: true,
  //   'cf-pdf-placing-comment': props.isPlacingAnnotation
  // });

  // // When you rotate a page 90 or 270 degrees there is a translation at the top equal to the difference
  // // between the current width and current height. We need to undo that translation to get things to align.
  // const translateX = (Math.sin((props.rotation / 180) * Math.PI) * (outerDivHeight - outerDivWidth)) / 2;
  // const divPageStyle = {
  //   marginBottom: `${PAGE_MARGIN * props.scale}px`,
  //   width: `${outerDivWidth}px`,
  //   height: `${outerDivHeight}px`,
  //   verticalAlign: 'top',
  //   display: props.isFileVisible ? '' : 'none'
  // };

  // // Pages that are currently drawing should not be visible since they may be currently rendered
  // // at the wrong scale.
  // const pageContentsVisibleClass = classNames({
  //   'cf-pdf-page-hidden': props.isDrawing
  // });

  // // This div is the one responsible for rotating the page. It is within the outer div which changes
  // // its width and height based on whether this page has been rotated to be in a portrait or landscape view.
  // const innerDivStyle = {
  //   transform: `rotate(${props.rotation}deg) translateX(${translateX}px)`
  // };

  // const getDivDimensions = () => {
  //   const innerDivDimensions = {
  //     innerDivWidth: get(this.props.pageDimensions, ['width'], PDF_PAGE_WIDTH),
  //     innerDivHeight: get(this.props.pageDimensions, ['height'], PDF_PAGE_HEIGHT)
  //   };

  //   // If we have rotated the page, we need to switch the width and height.
  //   if (this.props.rotation === 90 || this.props.rotation === 270) {
  //     return {
  //       outerDivWidth: this.props.scale * innerDivDimensions.innerDivHeight,
  //       outerDivHeight: this.props.scale * innerDivDimensions.innerDivWidth,
  //       ...innerDivDimensions
  //     };
  //   }

  //   return {
  //     outerDivWidth: this.props.scale * innerDivDimensions.innerDivWidth,
  //     outerDivHeight: this.props.scale * innerDivDimensions.innerDivHeight,
  //     ...innerDivDimensions
  //   };
  // };

  // return (
    // <div
    //   id={this.props.isFileVisible ? `pageContainer${pageNumberOfPageIndex(this.props.pageIndex)}` : null}
    //   className={pageClassNames}
    //   style={divPageStyle}
    //   ref={containerRef}
    // >
    //   <div
    //     id={this.props.isFileVisible ? `rotationDiv${pageNumberOfPageIndex(this.props.pageIndex)}` : null}
    //     className={pageContentsVisibleClass}
    //     style={innerDivStyle}
    //   >
    //     <canvas ref={canvasRef} className="canvasWrapper" />
    //   </div>
    // </div>
  // );
};

export default CorrespondencePdfDocument;
