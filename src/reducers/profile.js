import {
    PROFILE_PAGE_LOADED,
    UPDATE_FIELD_FRIEND,
    ADD_FRIEND_LOADED,
    ADD_FRIEND,
    DELETE_FRIEND
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case ADD_FRIEND_LOADED:
            return {
                ...state,
                friends: action.error ? null : action.payload.body.results[0],
                addedFriend: false,
                errors: action.error ? action.payload : null,
                group_name: ''
            };
        case PROFILE_PAGE_LOADED:
            return {
                ...state,
                pager: action.pager,
                articles: action.error ? null : action.payload[1].body.results,
                articlesCount: action.error ? null : action.payload[1].body.count,
                currentPage: 0,
                profile: action.payload[0].body.results[0],
                group_name: '',
            };
        case ADD_FRIEND:
            return {...state,
                confirm: action.error ? null : action.payload.body.username,
                errors: action.error ? action.payload : null,
                addedFriend: action.error ? false : true,
                group_name: ''
            };
        case DELETE_FRIEND:
            return {...state,
                deletedFriend: action.error ? false : true,
            };
        case UPDATE_FIELD_FRIEND:
            return {...state, [action.key]: action.value };
        default:
            return state;
    }
};