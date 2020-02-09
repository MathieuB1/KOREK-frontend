import {
    FRIEND_PAGE_LOADED,
    FRIEND_PAGE_UNLOADED,
    LOAD_ASKER_FRIENDS,
    VALIDATE_ASKER,
    SET_PAGE
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case FRIEND_PAGE_LOADED:
            return {...state,
                pager: action.pager,
                articles: action.error ? null : action.payload.body.results,
                articlesCount: action.error ? 0 : action.payload.body.count,
                currentPage: 0,
                tab: action.tab
            };
        case SET_PAGE:
            return {
                ...state,
                articles: action.payload.body.results,
                articlesCount: action.payload.body.count,
                currentPage: action.page,
                validate: false
            };
        case VALIDATE_ASKER:
            return {
                ...state,
                users_to_validate: action.error ? null : action.payload.body,
                errors: action.error ? action.payload : null,
                validate: true,
            };
        case LOAD_ASKER_FRIENDS:
            return {
                ...state,
                users_to_validate: action.error ? null : action.payload.body.results,
                errors: action.error ? action.payload : null
            };
        case FRIEND_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};