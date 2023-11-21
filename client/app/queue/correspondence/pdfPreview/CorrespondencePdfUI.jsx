import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import { FitToScreenIcon } from '../../../components/icons/FitToScreenIcon';
import { RotateIcon } from '../../../components/icons/RotateIcon';
import { DownloadIcon } from '../../../components/icons/DownloadIcon';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import * as Constants from '../../../reader/constants';
import Link from '../../../components/Link';
import { css } from 'glamor';
import classNames from 'classnames';
import { ExternalLinkIcon } from '../../../components/icons/ExternalLinkIcon';
import DocumentSearch from '../../../reader/DocumentSearch';
import _, { get, has, map, size, sortBy } from 'lodash';
import CorrespondencePage2 from './CorrespondencePage2';
import { categoryFieldNameOfCategoryName } from '../../../reader/utils';

const CorrespondencePdfUI = () => {
  // Destructured Props and State
  // const {
  //   documentPathBase,
  //   doc
  // } = props;

  const documentPathBase = '/2941741/documents';
  const doc = {
    id: 13,
    category_medical: null,
    category_other: null,
    category_procedural: null,
    created_at: '2023-11-16T10:08:41.948-05:00',
    description: null,
    file_number: '686623298',
    previous_document_version_id: null,
    received_at: '2023-11-17',
    series_id: '4230620',
    type: 'Private Medical Treatment Record',
    updated_at: '2023-11-20T14:58:49.681-05:00',
    upload_date: '2023-11-18',
    vbms_document_id: '110',
    content_url: '/document/13/pdf',
    filename: 'filename-9265746.pdf',
    category_case_summary: true,
    serialized_vacols_date: '',
    serialized_receipt_date: '11/17/2023',
    'matching?': false,
    opened_by_current_user: true,
    tags: [],
    receivedAt: '2023-11-17',
    listComments: false,
    wasUpdated: false
  };

  const [scale, setScale] = useState(1);
  const [searchBarToggle, setSearchBarToggle] = useState(false);

  // Constants
  const ZOOM_RATE = 0.3;
  const MINIMUM_ZOOM = 0.1;

  const ROTATION_INCREMENTS = 90;
  const COMPLETE_ROTATION = 360;

  // In-Line CSS Styles
  // PDF Document Viewer is 800px wide or less.
  const pdfWrapperSmall = 1165;

  const pdfToolbarStyles = {
    openSidebarMenu: css({ marginRight: '2%' }),
    toolbar: css({ width: '33%' }),
    toolbarLeft: css({
      '&&': { [`@media(max-width:${pdfWrapperSmall}px)`]: {
        width: '18%' }
      }
    }),
    toolbarCenter: css({
      '&&': { [`@media(max-width:${pdfWrapperSmall}px)`]: {
        width: '24%' }
      }
    }),
    toolbarRight: css({
      textAlign: 'right',
      '&&': { [`@media(max-width:${pdfWrapperSmall}px)`]: {
        width: '44%',
        '& .cf-pdf-button-text': { display: 'none' } }
      }
    }),
    footer: css({
      position: 'absolute',
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      '&&': { [`@media(max-width:${pdfWrapperSmall}px)`]: {
        '& .left-button-label': { display: 'none' },
        '& .right-button-label': { display: 'none' }
      } }
    })
  };

  const pdfUiClass = classNames(
    'cf-pdf-container');

  const pdfWrapper = css({
    width: '72%',
    '@media(max-width: 920px)': {
      width: 'unset',
      right: '250px' },
    '@media(min-width: 1240px )': {
      width: 'unset',
      right: '380px' }
  });

  // ////////////// //
  // PDF Functions  //
  // ////////////// //

  // Zoom
  const zoomOut = () => {
    const nextScale = Math.max(MINIMUM_ZOOM, _.round(scale - ZOOM_RATE, 2));

    setScale(nextScale);
  };

  const zoomIn = () => {
    const nextScale = Math.max(MINIMUM_ZOOM, _.round(scale + ZOOM_RATE, 2));

    setScale(nextScale);
  };

  const fitToScreen = () => {
    setScale(1);
  };

  // Rotations
  const handleDocumentRotation = (docId) => {
    console.log('hi');
  };

  // Search Bar
  const handleSearchBarToggle = () => {
    setSearchBarToggle(!searchBarToggle);
  };

  // Downlaod

  const openDownloadLink = () => {
    window.open(`${doc.content_url}?type=${doc.type}&download=true`);
  }

  return (
    <div className={pdfUiClass} {...pdfWrapper}>
      <div className="cf-pdf-header cf-pdf-toolbar">
        <span {...pdfToolbarStyles.toolbar} {...pdfToolbarStyles.toolbarCenter}>
          <span className="category-icons-and-doc-type">
            <span className="cf-pdf-doc-category-icons">
              <CorrespondenceDocumentCategoryIcons doc={doc} />
            </span>
            <span className="cf-pdf-doc-type-button-container">
              <Link
                name="newTab"
                ariaLabel="open document in new tab"
                target="_blank"
                button="matte"
                href={`/reader/appeal${documentPathBase}/${doc.id}`}>
                <h1 className="cf-pdf-vertically-center cf-non-stylized-header">
                  <span title="Open in new tab">{doc.type}</span>
                  <span className="cf-pdf-external-link-icon"><ExternalLinkIcon /></span>
                </h1>
              </Link>
            </span>
          </span>
        </span>
        <span {...pdfToolbarStyles.toolbar} {...pdfToolbarStyles.toolbarRight}>
          <span className="cf-pdf-button-text">Zoom:</span>
          <Button
            name="zoomOut"
            classNames={['cf-pdf-button cf-pdf-spaced-buttons']}
            onClick={zoomOut}
            ariaLabel="zoom out">
            <i className="fa fa-minus" aria-hidden="true" />
          </Button>
          <Button
            name="zoomIn"
            classNames={['cf-pdf-button cf-pdf-spaced-buttons']}
            onClick={zoomIn}
            ariaLabel="zoom in">
            <i className="fa fa-plus" aria-hidden="true" />
          </Button>
          <Button
            name="fit"
            classNames={['cf-pdf-button cf-pdf-spaced-buttons']}
            onClick={fitToScreen}
            ariaLabel="fit to screen">
            <FitToScreenIcon />
          </Button>
          <Button
            name="rotation"
            classNames={['cf-pdf-button cf-pdf-spaced-buttons']}
            onClick={handleDocumentRotation}
            ariaLabel="rotate document">
            <RotateIcon />
          </Button>
          <span className="cf-pdf-spaced-buttons">|</span>
          <Button
            name="download"
            classNames={['cf-pdf-button cf-pdf-download-icon']}
            onClick={openDownloadLink}
            ariaLabel="download pdf">
            <DownloadIcon />
          </Button>
          <Button
            name="search"
            classNames={['cf-pdf-button cf-pdf-search usa-search usa-search-small']}
            ariaLabel="search text"
            type="submit"
            onClick={handleSearchBarToggle}>
            <SearchIcon />
          </Button>
        </span>
      </div>

      <div>
        <CorrespondencePage2
          scale={scale}
        />
        {/* <DocumentSearch file={this.props.doc.content_url} featureToggles={this.props.featureToggles} />
        <Pdf
          documentId={this.props.doc.id}
          documentPathBase={this.props.documentPathBase}
          documentType={this.props.doc.type}
          file={this.props.doc.content_url}
          id={this.props.id}
          history={this.props.history}
          onPageClick={this.props.onPageClick}
          scale={this.props.scale}
          onPageChange={this.onPageChange}
          prefetchFiles={this.props.prefetchFiles}
          resetJumpToPage={this.props.resetJumpToPage}
          featureToggles={this.props.featureToggles}
        /> */}
      </div>

      {/* { this.getPdfFooter() } */}
    </div>
  );
};

const CorrespondenceDocumentCategoryIcons = ({ doc }) => {

  // Helper function
  const categoriesOfDocument = (document) =>
    sortBy(
      Object.keys(Constants.documentCategories).reduce((list, name) => {
        if (document[categoryFieldNameOfCategoryName(name)]) {
          return {
            ...list,
            [name]: Constants.documentCategories[name]
          };
        }

        return list;
      }, {}),
      'renderOrder'
    );

  const categories = categoriesOfDocument(doc);

  if (!size(categories)) {
    return null;
  }
  const listClassName = 'cf-no-styling-list';

  return (
    <ul className="cf-document-category-icons" aria-label="document categories">
      {map(categories, (category) => (
        <li
          className={listClassName}
          key={category.renderOrder}
          aria-label={category.humanName}
        >
          {category.svg}
        </li>
      ))}
    </ul>
  );
};

CorrespondenceDocumentCategoryIcons.propTypes = {
  doc: PropTypes.object.isRequired,
};

export default CorrespondencePdfUI;
