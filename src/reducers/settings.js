import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_LOADED,
  SETTINGS_PAGE_UNLOADED,
  ASYNC_START
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_SAVED:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload : null
      };
    case SETTINGS_PAGE_UNLOADED:
      return {
        ...state,
        errors: action.error ? action.payload : null
      };
    case SETTINGS_PAGE_LOADED:
      return {
        ...state,
        settings: action.payload.body.results[0],
        errors: null,
      };
    case ASYNC_START:
      return {
        ...state,
        inProgress: true
      };
    default:
      return state;
  }
};
