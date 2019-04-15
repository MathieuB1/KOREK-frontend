import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ARTICLE_PAGE_LOADED:
      return {
        ...state,
        article: action.payload[0].body,
        highlight: action.payload[1].text
      };
    case ARTICLE_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
