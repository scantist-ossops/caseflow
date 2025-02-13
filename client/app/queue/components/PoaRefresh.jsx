import React from 'react';
import PropTypes from 'prop-types';
import { formatDateStr } from '../../util/DateUtil';
import COPY from '../../../COPY';
import { css } from 'glamor';
import { sprintf } from 'sprintf-js';
import { useSelector } from 'react-redux';

import { boldText } from '../constants';

import { PoaRefreshButton } from './PoaRefreshButton';

export const textStyling = css({
  display: 'flex',
  justifyContent: 'space-between'
});

export const syncStyling = css({
  textAlign: 'right',
  width: '33%'
});

export const gutterStyling = css({
  width: '5%'
});

export const marginTopStyling = css({
  marginTop: '-45px'
});

export const PoaRefresh = ({ powerOfAttorney, appealId }) => {
  const poaSyncInfo = {
    poaSyncDate: formatDateStr(powerOfAttorney.poa_last_synced_at) || formatDateStr(new Date())
  };

  const lastSyncedCopy = sprintf(COPY.CASE_DETAILS_POA_LAST_SYNC_DATE_COPY, poaSyncInfo);
  const viewPoaRefresh = useSelector((state) => state.ui.featureToggles.poa_button_refresh);
  const businessLineUrl = useSelector((state) => state.businessLineUrl);

  return <React.Fragment>
    {viewPoaRefresh &&
    <div {...textStyling}>
      <em>{ COPY.CASE_DETAILS_POA_REFRESH_BUTTON_EXPLANATION }</em>
      <div {...gutterStyling}></div>
      <div {...boldText}{...syncStyling}{...(businessLineUrl === 'vha' ? marginTopStyling : { })}>
        {poaSyncInfo.poaSyncDate &&
          <em>{lastSyncedCopy}</em>
        }
        <PoaRefreshButton appealId={appealId} />
      </div>
    </div>
    }
  </React.Fragment>;
};

PoaRefresh.propTypes = {
  powerOfAttorney: PropTypes.shape({
    poa_last_synced_at: PropTypes.string
  }),
  appealId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};
