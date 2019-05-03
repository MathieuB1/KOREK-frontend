import {
    TAG_PAGE_LOADED,
    TAG_PAGE_UNLOADED,
    SET_PAGE
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case TAG_PAGE_LOADED:
            return {
                ...state,
                pager: action.error ? null : action.pager,
                articles: action.error ? null : action.payload.body.results,
                articlesCount: action.error ? null : action.payload.body.count,
                loading: false,
                currentPage: 0,
            };
        case SET_PAGE:
            return {
                ...state,
                articles: action.payload.body.results,
                articlesCount: action.payload.body.count,
                currentPage: action.page
            };
        case TAG_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};