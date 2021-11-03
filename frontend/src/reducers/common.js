import {
    REQUEST_CSRF,
    APP_LOAD,
    REDIRECT,
    LOGOUT,
    ARTICLE_SUBMITTED,
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    LOGIN,
    CLEAR_TOKEN,
    REGISTER,
    DELETE_ARTICLE,
    DELETE_PROFILE_ARTICLE,
    ARTICLE_PAGE_UNLOADED,
    EDITOR_PAGE_UNLOADED,
    HOME_PAGE_UNLOADED,
    PROFILE_PAGE_UNLOADED,
    LOGIN_PAGE_UNLOADED,
    REGISTER_PAGE_UNLOADED,
    ADD_FRIEND_LOADED,
    ADD_FRIEND,
    IMAGE_LOAD,
    DISPLAY_MODE,
    FILTERS_LOADED,
    SEARCHING,
    LOCATION_SEARCHING,
    FETCH_IMAGE_MEDIA
} from '../constants/actionTypes';

const defaultState = {
    appName: 'KOREK',
    csrf: null,
    token: null,
    viewChangeCounter: 0
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case REQUEST_CSRF:
            return {
                ...state,
                csrf: action.csrf || null,
                csrfLoaded: true
            };
        case LOGIN:
            return {
                ...state,
                redirectTo: action.error ? null : '/',
                token: action.error ? null : action.payload.body.token,
                currentUser: action.error ? null : action.payload.req._data.username
            };
        case CLEAR_TOKEN:
            return {
                ...state,
                redirectTo: '/login/',
                token: null,
            };
        case APP_LOAD:
            return {
                ...state,
                csrf: action.csrf || null,
                token: action.token || null,
                appLoaded: true,
                currentUser: action.error ? null : action.username,
                errors: action.error ? action.payload : null,
            };
        case FETCH_IMAGE_MEDIA:
            return {
                ...state,
                media: action.payload ? action.payload.body : null,
                media_name: action.payload ? action.payload.req.url : null,
            };
        case IMAGE_LOAD:
            return {
                ...state,
                currentUserImage: (action.payload.body.results.length > 0) ? action.payload.body.results[0].image : null,
            };
        case FILTERS_LOADED:
            return {
                ...state,
                categories: action.payload[0] && action.payload[0].body ? action.payload[0].body : null,
                tags: action.payload[1] && action.payload[1].body ? action.payload[1].body.results : null,
            };
        case SETTINGS_SAVED:
            return {
                ...state,
                redirectTo: action.error ? null : '/',
                currentUser: action.error ? state.currentUser : action.payload.body.username,
                currentUserImage: null
            };
        case SETTINGS_PAGE_UNLOADED:
            return {
                ...state,
                redirectTo: action.error ? null : '/',
                csrf: action.error ? state.csrf : null,
                token: action.error ? state.token : null,
                currentUser: action.error ? state.currentUser : null
            };
        case REDIRECT:
            return {...state, redirectTo: null };
        case LOGOUT:
            return {...state, redirectTo: '/', csrf: null, token: null, currentUser: null };
        case ARTICLE_SUBMITTED:
            var redirectUrl = null;
            if (action.payload.body) {
                redirectUrl = `/products/${action.payload.body.id}/`
            }
            return {...state, redirectTo: action.error ? null : redirectUrl };

        case REGISTER:
            return {...state,
                redirectTo: action.error ? null : '/',
            };
        case DELETE_ARTICLE:
            return {...state, redirectTo: '/' };
        case ADD_FRIEND_LOADED:
            return {...state };
        case ADD_FRIEND:
            return {...state,
                redirectTo: action.error ? null : '/users/'
            };
        case DISPLAY_MODE:
            return {...state,
                display_mode: action.error ? null : action.mode
            };
        case SEARCHING:
            return {...state,
                criteria: action.criteria,
                search: action.search,
                selected_category: action.selected_category,
                selected_tags: action.selected_tags,
            };
        case LOCATION_SEARCHING:
            return {...state,
                bbox: action.bbox
            };
        case LOGIN_PAGE_UNLOADED:
        case DELETE_PROFILE_ARTICLE:
        case ARTICLE_PAGE_UNLOADED:
        case EDITOR_PAGE_UNLOADED:
        case HOME_PAGE_UNLOADED:
        case PROFILE_PAGE_UNLOADED:
        case REGISTER_PAGE_UNLOADED:
            return {...state, viewChangeCounter: state.viewChangeCounter + 1 };
        default:
            return state;
    }
};