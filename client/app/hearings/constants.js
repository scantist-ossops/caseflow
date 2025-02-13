import HEARING_REQUEST_TYPES from '../../constants/HEARING_REQUEST_TYPES';

export const ACTIONS = {
  RECEIVE_PAST_UPLOADS: 'RECEIVE_PAST_UPLOADS',
  RECEIVE_SCHEDULE_PERIOD: 'RECEIVE_SCHEDULE_PERIOD',
  RECEIVE_REGIONAL_OFFICES: 'RECEIVE_REGIONAL_OFFICES',
  RECEIVE_DAILY_DOCKET: 'RECEIVE_DAILY_DOCKET',
  RECEIVE_HEARING: 'RECEIVE_HEARING',
  RECEIVE_SAVED_HEARING: 'RECEIVE_SAVED_HEARING',
  RESET_SAVE_SUCCESSFUL: 'RESET_SAVE_SUCCESSFUL',
  RECEIVE_HEARING_DAY_OPTIONS: 'RECEIVE_HEARING_DAY_OPTIONS',
  RECEIVE_UPCOMING_HEARING_DAYS: 'RECEIVE_UPCOMING_HEARING_DAYS',
  REGIONAL_OFFICE_CHANGE: 'REGIONAL_OFFICE_CHANGE',
  RECEIVE_APPEALS_READY_FOR_HEARING: 'RECEIVE_APPEALS_READY_FOR_HEARING',
  SELECTED_HEARING_DAY_CHANGE: 'SELECTED_HEARING_DAY_CHANGE',
  FILE_TYPE_CHANGE: 'FILE_TYPE_CHANGE',
  RECEIVE_HEARING_SCHEDULE: 'RECEIVE_HEARING_SCHEDULE',
  INPUT_INVALID_DATES: 'INPUT_INVALID_DATES',
  RESET_INVALID_DATES: 'RESET_INVALID_DATES',
  SCHEDULE_PERIOD_ERROR: 'SCHEDULE_PERIOD_ERROR',
  REMOVE_SCHEDULE_PERIOD_ERROR: 'REMOVE_SCHEDULE_PERIOD_ERROR',
  SET_VACOLS_UPLOAD: 'SET_VACOLS_UPLOAD',
  RO_CO_START_DATE_CHANGE: 'RO_CO_START_DATE_CHANGE',
  RO_CO_END_DATE_CHANGE: 'RO_CO_END_DATE_CHANGE',
  RO_CO_FILE_UPLOAD: 'RO_CO_FILE_UPLOAD',
  JUDGE_START_DATE_CHANGE: 'JUDGE_START_DATE_CHANGE',
  JUDGE_END_DATE_CHANGE: 'JUDGE_END_DATE_CHANGE',
  JUDGE_FILE_UPLOAD: 'JUDGE_FILE_UPLOAD',
  UPDATE_UPLOAD_FORM_ERRORS: 'UPDATE_UPLOAD_FORM_ERRORS',
  UPDATE_RO_CO_UPLOAD_FORM_ERRORS: 'UPDATE_RO_CO_UPLOAD_FORM_ERRORS',
  UPDATE_JUDGE_UPLOAD_FORM_ERRORS: 'UPDATE_JUDGE_UPLOAD_FORM_ERRORS',
  UNSET_UPLOAD_ERRORS: 'UNSET_UPLOAD_ERRORS',
  TOGGLE_UPLOAD_CONTINUE_LOADING: 'TOGGLE_UPLOAD_CONTINUE_LOADING',
  VIEW_START_DATE_CHANGE: 'VIEW_START_DATE_CHANGE',
  VIEW_END_DATE_CHANGE: 'VIEW_END_DATE_CHANGE',
  CLICK_CONFIRM_ASSIGNMENTS: 'CLICK_CONFIRM_ASSIGNMENTS',
  CLICK_CLOSE_MODAL: 'CLICK_CLOSE_MODAL',
  CONFIRM_ASSIGNMENTS_UPLOAD: 'CONFIRM_ASSIGNMENTS_UPLOAD',
  UNSET_SUCCESS_MESSAGE: 'UNSET_SUCCESS_MESSAGE',
  TOGGLE_TYPE_FILTER_DROPDOWN: 'TOGGLE_TYPE_FILTER_DROPDOWN',
  TOGGLE_LOCATION_FILTER_DROPDOWN: 'TOGGLE_LOCATION_FILTER_DROPDOWN',
  TOGGLE_VLJ_FILTER_DROPDOWN: 'TOGGLE_VLJ_FILTER_DROPDOWN',
  SELECT_REQUEST_TYPE: 'SELECT_REQUEST_TYPE',
  SELECT_VLJ: 'SELECT_VLJ',
  SELECT_COORDINATOR: 'SELECT_COORDINATOR',
  SELECT_HEARING_ROOM: 'SELECT_HEARING_ROOM',
  SET_NOTES: 'SET_NOTES',
  RECEIVE_JUDGES: 'RECEIVE_JUDGES',
  RECEIVE_COORDINATORS: 'RECEIVE_COORDINATORS',
  HEARING_DAY_MODIFIED: 'HEARING_DAY_MODIFIED',
  ON_CLICK_REMOVE_HEARING_DAY: 'ON_CLICK_REMOVE_HEARING_DAY',
  CANCEL_REMOVE_HEARING_DAY: 'CANCEL_REMOVE_HEARING_DAY',
  SUCCESSFUL_HEARING_DAY_DELETE: 'SUCCESSFUL_HEARING_DAY_DELETE',
  SUCCESSFUL_HEARING_DAY_CREATE: 'SUCCESSFUL_HEARING_DAY_CREATE',
  RESET_DELETE_SUCCESSFUL: 'RESET_DELETE_SUCCESSFUL',
  ASSIGN_HEARING_ROOM: 'ASSIGN_HEARING_ROOM',
  DISPLAY_LOCK_MODAL: 'DISPLAY_LOCK_MODAL',
  CANCEL_DISPLAY_LOCK_MODAL: 'CANCEL_DISPLAY_LOCK_MODAL',
  UPDATE_LOCK: 'UPDATE_LOCK',
  RESET_LOCK_SUCCESS_MESSAGE: 'RESET_LOCK_SUCCESS_MESSAGE',
  HANDLE_DAILY_DOCKET_SERVER_ERROR: 'HANDLE_DAILY_DOCKET_SERVER_ERROR',
  RESET_DAILY_DOCKET_AFTER_SERVER_ERROR: 'RESET_DAILY_DOCKET_AFTER_SERVER_ERROR',
  HANDLE_LOCK_HEARING_SERVER_ERROR: 'HANDLE_LOCK_HEARING_SERVER_ERROR',
  RESET_LOCK_HEARING_SERVER_ERROR: 'RESET_LOCK_HEARING_SERVER_ERROR',
  UPDATE_DOCKET_HEARING: 'UPDATE_DOCKET_HEARING',
  SET_REPNAME: 'SET_REPNAME',
  SET_WITNESS: 'SET_WITNESS',
  SET_HEARING_PREPPED: 'SET_HEARING_PREPPED',
  POPULATE_WORKSHEET: 'POPULATE_WORKSHEET',
  SET_HEARING_DAY_HEARINGS: 'SET_HEARING_DAY_HEARINGS',
  SET_DESCRIPTION: 'SET_DESCRIPTION',
  SET_ISSUE_NOTES: 'SET_ISSUE_NOTES',
  SET_WORKSHEET_ISSUE_NOTES: 'SET_WORKSHEET_ISSUE_NOTES',
  SET_ISSUE_DISPOSITION: 'SET_ISSUE_DISPOSITION',
  SET_REOPEN: 'SET_REOPEN',
  SET_ALLOW: 'SET_ALLOW',
  SET_DENY: 'SET_DENY',
  SET_REMAND: 'SET_REMAND',
  SET_DISMISS: 'SET_DISMISS',
  SET_OMO: 'SET_OMO',
  ADD_ISSUE: 'ADD_ISSUE',
  DELETE_ISSUE: 'DELETE_ISSUE',
  TOGGLE_ISSUE_DELETE_MODAL: 'TOGGLE_ISSUE_DELETE_MODAL',
  SET_MILITARY_SERVICE: 'SET_MILITARY_SERVICE',
  SET_SUMMARY: 'SET_SUMMARY',
  TOGGLE_WORKSHEET_SAVING: 'TOGGLE_WORKSHEET_SAVING',
  SET_WORKSHEET_TIME_SAVED: 'SET_WORKSHEET_TIME_SAVED',
  SET_ISSUE_EDITED_FLAG_TO_FALSE: 'SET_ISSUE_EDITED_FLAG_TO_FALSE',
  SET_WORKSHEET_SAVE_FAILED_STATUS: 'SET_WORKSHEET_SAVE_FAILED_STATUS',
  SET_WORKSHEET_EDITED_FLAG_TO_FALSE: 'SET_WORKSHEET_EDITED_FLAG_TO_FALSE',
  HANDLE_CONFERENCE_LINK_ERROR: 'HANDLE_CONFERENCE_LINK_ERROR'
};

// Labels for guest link
export const GUEST_LINK_LABELS = {
  COPY_GUEST_LINK: 'Copy Guest Link',
  GUEST_LINK_SECTION_LABEL: 'Guest links for non-virtual hearings',
  GUEST_CONFERENCE_ROOM: 'Conference Room',
  GUEST_PIN: 'PIN',
}

export const SPREADSHEET_TYPES = {
  RoSchedulePeriod: {
    value: 'RoSchedulePeriod',
    shortDisplay: 'RO/CO',
    display: 'RO/CO hearings',
    template: '/ROAssignmentTemplate.xlsx'
  },
  JudgeSchedulePeriod: {
    value: 'JudgeSchedulePeriod',
    shortDisplay: 'Judge',
    display: 'Judge assignment',
  }
};

export const DISPOSITION_OPTIONS = [{ value: 'held',
  label: 'Held' },
{ value: 'no_show',
  label: 'No Show' },
{ value: 'cancelled',
  label: 'Cancelled' },
{ value: 'postponed',
  label: 'Postponed' },
{ value: 'scheduled_in_error',
  label: 'Scheduled in Error' }];

export const VIDEO_HEARING_LABEL = 'Video';
export const CENTRAL_OFFICE_HEARING_LABEL = 'Central';
export const TRAVEL_BOARD_HEARING_LABEL = 'Travel';
export const VIRTUAL_HEARING_LABEL = 'Virtual';

// Given a Docket request type return readable request type for that Docket.
export const DOCKET_READABLE_REQUEST_TYPE = {
  R: VIRTUAL_HEARING_LABEL,
  V: VIDEO_HEARING_LABEL,
  T: TRAVEL_BOARD_HEARING_LABEL,
  C: CENTRAL_OFFICE_HEARING_LABEL
};

export const LIST_SCHEDULE_VIEWS = {
  DEFAULT_VIEW: 'DEFAULT_VIEW',
  SHOW_ALL: 'SHOW_ALL'
};

export const HEARING_CONVERSION_TYPES = [
  'change_to_virtual',
  'change_from_virtual',
  'change_email_or_timezone',
  'change_hearing_time'
];

export const REQUEST_TYPE_OPTIONS = [
  { label: 'Video',
    value: HEARING_REQUEST_TYPES.video },
  { label: 'Central',
    value: HEARING_REQUEST_TYPES.central },
  { label: 'Travel',
    value: HEARING_REQUEST_TYPES.travel },
  { label: 'Virtual',
    value: HEARING_REQUEST_TYPES.virtual }
];

export const ENDPOINT_NAMES = {
  HEARINGS_SCHEDULE: 'hearings-schedule',
  UPCOMING_HEARING_DAYS: 'upcoming-hearing-days'
};

/* eslint-disable id-length */
export const REQUEST_TYPE_LABELS = {
  R: 'Virtual',
  V: 'Video',
  C: 'Central',
  T: 'Travel'
};
/* eslint-enable id-length */
