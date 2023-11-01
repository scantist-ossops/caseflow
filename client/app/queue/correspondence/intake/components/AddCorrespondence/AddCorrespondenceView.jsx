/* eslint-disable max-lines */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Table from '../../../../../components/Table';
import Checkbox from '../../../../../components/Checkbox';
import RadioField from '../../../../../components/RadioField';
import ApiUtil from '../../../../../util/ApiUtil';
import uuid from 'uuid';

const priorMailAnswer = [
  { displayText: 'Yes',
    value: 'yes' },
  { displayText: 'No',
    value: 'no' }
];

export const getRowObjects = () => {
  return ApiUtil.get(`/queue/correspondence/e1d300ea-7fa3-44a3-ad24-443f19621921/intake?json`).then((response) => {
    const returnedObject = response.body.correspondence;

    return returnedObject;

  }).
    catch((err) => {
      console.error(new Error(`Problem with GET /queue/corresondence/e1d300ea-7fa3-44a3-ad24-443f19621921/intake?json ${err}`));

      return [];
    });
};

class AddCorrespondenceView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: false,
      checked: false,
      veteran_id: '',
      va_date_of_receipt: '',
      source_type: '',
      package_document_type: '',
      correspondence_type_id: '',
      notes: '',
      selectedRadio: 'no',
    };
  }

  setSelectedValue = () => {
    this.setState({ selectedValue: true });
  }

  handleRadioChange = (selectedRadio) => {
    if (this.state.selectedRadio !== selectedRadio) {
      this.setState({
        selectedRadio
      });
    }
  };

  getKeyForRow = (index, { hasCorrespondence, id }) => {
    return hasCorrespondence ? `${id}-comment` : `${id}`;
  };

  // eslint-disable-next-line max-statements
  getDocumentColumns = (row) => {
    return [
      {
        cellClass: 'checkbox-column',
        valueFunction: () => (
          <Checkbox
            name={row.id}
          />
        ),
      },
      {
        cellClass: 'va-dor-column',
        ariaLabel: 'va-dor-header-label',
        header: (
          <div id="va-dor-header">
            <span id="va-dor-header-label" className="table-header-label">
              VA DOR
            </span>
          </div>
        ),
      },
      {
        cellClass: 'source-type-column',
        ariaLabel: 'source-type-header-label',
        header: (
          <div id="source-type-header">
            <span id="source-type-header-label" className="table-header-label">
              VA DOR
            </span>
          </div>
        ),
      },
      {
        cellClass: 'package-document-type-column',
        ariaLabel: 'package-document-type-header-label',
        header: (
          <div id="package-document-type-header">
            <span id="package-document-type-header-label" className="table-header-label">
              VA DOR
            </span>
          </div>
        ),
      },
      {
        cellClass: 'correspondence-type-column',
        ariaLabel: 'correspondence-type-header-label',
        header: (
          <div id="correspondence-type-header">
            <span id="correspondence-type-header-label" className="table-header-label">
              VA DOR
            </span>
          </div>
        ),
      },
      {
        cellClass: 'notes-column',
        ariaLabel: 'notes-header-label',
        header: (
          <div id="notes-header">
            <span id="notes-header-label" className="table-header-label">
              VA DOR
            </span>
          </div>
        ),
      },
    ];
  };

  render() {
    const rowObjects = getRowObjects(
      this.props.correspondence
    );

    return (
      <div className="cf-app-segment cf-app-segment--alt">
        <h1>Add Related Correspondence</h1>
        <p>Add any related correspondence to the mail package that is in progress.</p>
        <br></br>
        <h2>Associate with prior Mail</h2>
        <p>Is this correspondence related to prior mail?</p>
        <RadioField
          name=""
          options={priorMailAnswer}
          value={this.state.selectedRadio}
          onChange={this.handleRadioChange} />
        {this.state.selectedRadio === 'yes' && (
          <div className="cf-app-segment cf-app-segment--alt">
            <p>Please select the prior mail to link to this correspondence</p>
            <p>Viewing 1-15 out of 200 total</p>
            <div>
              <Table
                columns={this.getDocumentColumns()}
                rowObjects={rowObjects}
                summary="Correspondence list"
                className="correspondence-table"
                headerClassName="cf-correspondence-list-header-row"
                bodyClassName="cf-correspondence-list-body"
                tbodyId="correspondence-table-body"
                getKeyForRow={this.getKeyForRow}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

AddCorrespondenceView.propTypes = {
  correspondence: PropTypes.arrayOf(PropTypes.object),
  featureToggles: PropTypes.object,
  uuid: PropTypes.uuid
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    dispatch
  );

export default connect(
  mapDispatchToProps
)(AddCorrespondenceView);
