import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import common from './reducers/common';
import editor from './reducers/editor';
import home from './reducers/home';
import profile from './reducers/profile';
import friend from './reducers/friend';
import tag from './reducers/tag';
import settings from './reducers/settings';
import websocket from './reducers/websocket';

const createRootReducer = (history) => combineReducers({
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
    websocket,
    router: connectRouter(history)
});

export default createRootReducer;