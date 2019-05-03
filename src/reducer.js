import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import editor from './reducers/editor';
import home from './reducers/home';
import profile from './reducers/profile';
import friend from './reducers/friend';
import tag from './reducers/tag';
import settings from './reducers/settings';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    article,
    articleList,
    auth,
    common,
    editor,
    home,
    profile,
    friend,
    settings,
    tag,
    router: routerReducer
});