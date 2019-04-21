import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  ASYNC_START,
  UPDATE_FIELD_EDITOR,
  DELETE_MEDIA,
  UPLOAD_PROGRESS
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        articleid: action.payload ? action.payload.body.id : '',
        title: action.payload ? action.payload.body.title : '',
        subtitle: action.payload ? action.payload.body.subtitle : '',
        images: action.payload ? action.payload.body.images : '',
        videos: action.payload ? action.payload.body.videos : '',
        audios: action.payload ? action.payload.body.audios : '',
        text: action.payload ? action.payload.body.text : '',
        uploadProgress: 0,
        inProgress: false,
        deleted: false
      };
    case UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.percent }
    case DELETE_MEDIA:
      return {...state,
        media_deleted: action.payload.req._data,
        deleted: action.error ? false : true}
    case EDITOR_PAGE_UNLOADED:
      return {};
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
