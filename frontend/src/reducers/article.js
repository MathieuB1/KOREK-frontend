import {
    ARTICLE_PAGE_LOADED,
    ARTICLE_PAGE_UNLOADED,
    ADD_COMMENT,
    DELETE_COMMENT
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case ARTICLE_PAGE_LOADED:
            if (action.error) {
                /* article could have been deleted, jwt expires or worst
                    manage connection in home page
                */
                return {...state, redirectTo: '/' };
            } else {
                return {
                    ...state,
                    redirectTo: null,
                    article: action.error ? null : action.payload[0].body,
                    comments: action.error ? null : action.payload[0].body.comments,
                    highlight: action.error ? null : action.payload[1].text
                }
            };
        case ARTICLE_PAGE_UNLOADED:
            return {
                ...state,
                redirectTo: null,
                article: null,
                comments: null,
                highlight: null
            }
        case ADD_COMMENT:
            return {
                ...state,
                commentErrors: action.error ? action.payload : null,
                comments: action.error ?
                    (state.comments || []) : [action.payload.body].concat(state.comments || [])
            };
        case DELETE_COMMENT:
            const commentId = action.commentId
            return {
                ...state,
                comments: action.error ? null : state.comments.filter(comment => comment.id !== commentId)
            };
        default:
            return state;
    }
};