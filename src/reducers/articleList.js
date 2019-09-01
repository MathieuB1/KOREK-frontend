import {
    SET_PAGE,
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED,
    CHANGE_TAB,
    PROFILE_PAGE_LOADED,
    PROFILE_PAGE_UNLOADED,
    SEARCHING
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case SEARCHING:
        case HOME_PAGE_LOADED:
            return {
                ...state,
                pager: action.error ? null : action.pager,
                articles: action.error ? null : action.payload.body.results,
                articlesCount: action.error ? null : action.payload.body.count,
                currentPage: 0,
                tab: action.error ? null : action.tab
            };
        case HOME_PAGE_UNLOADED:
            return {};
        case CHANGE_TAB:
            return {
                ...state,
                pager: action.pager,
                articles: action.payload.body.results,
                articlesCount: action.payload.body.count,
                tab: action.tab,
                currentPage: 0
            };
        case SET_PAGE:
            return {
                ...state,
                articles: action.payload.body.results,
                articlesCount: action.payload.body.count,
                currentPage: action.page
            };
        case PROFILE_PAGE_LOADED:
            return {
                ...state,
                pager: action.pager,
                articles: action.error ? null : action.payload[1].body.results,
                articlesCount: action.error ? null : action.payload[1].body.count,
                currentPage: 0
            };
        case PROFILE_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};