import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  ASYNC_START,
  UPDATE_FIELD_EDITOR,
  DELETE_MEDIA,
  UPLOAD_PROGRESS,
  TAGS_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:

      if (action.error) {
        /* article could have been deleted, jwt expires or worst
          manage connection in home page
        */
        return {...state, redirectTo: '/' };
      } else {
        return {
          ...state,
          redirectTo: null,
          articleid: action.error ? null : action.payload ? action.payload.body.id : '',
          title: action.error ? null : action.payload ? action.payload.body.title : '',
          subtitle: action.error ? null : action.payload ? action.payload.body.subtitle : '',
          images: action.error ? null : action.payload ? action.payload.body.images : '',
          videos: action.error ? null : action.payload ? action.payload.body.videos : '',
          audios: action.error ? null : action.payload ? action.payload.body.audios : '',
          files: action.error ? null : action.payload ? action.payload.body.files : '',
          text: action.error ? null : action.payload ? action.payload.body.text : '',
          private: action.error ? null : action.payload ? action.payload.body.private : false,
          category: action.error ? null : action.payload ? action.payload.body.category : null,
          tags_set: action.error ? null : action.payload ? action.payload.body.tags : null,
          uploadProgress: 0,
          inProgress: false,
          deleted: false
        }
    };
    case UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.percent }
    case DELETE_MEDIA:
      return {...state,
        media_deleted: action.payload.req._data,
        deleted: action.error ? false : true}
    case TAGS_LOADED:
        return {
            ...state,
            tags: action.error ? null : action.payload.body.results
        };
    case EDITOR_PAGE_UNLOADED:
      return { ...state };
    case ARTICLE_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload : null
      };
    case ASYNC_START:
      if (action.subtype === ARTICLE_SUBMITTED) {
        return { ...state, inProgress: true };
      }
      break;
    case UPDATE_FIELD_EDITOR:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
