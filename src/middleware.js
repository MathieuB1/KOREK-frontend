import agent from './agent';
import {
    ASYNC_START,
    ASYNC_END,
    REQUEST_CSRF,
    LOGIN,
    LOGOUT,
    SETTINGS_PAGE_UNLOADED,
    REGISTER
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {

        store.dispatch({ type: ASYNC_START, subtype: action.type });

        const currentView = store.getState().viewChangeCounter;
        const skipTracking = action.skipTracking;

        action.payload.then(
            res => {
                const currentState = store.getState()
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return
                }
                console.log('RESULT', res);
                action.payload = res;
                store.dispatch({ type: ASYNC_END, promise: action.payload });
                store.dispatch(action);
            },
            error => {
                const currentState = store.getState()
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return
                }

                console.log('ERROR', error);
                action.error = true;
                action.payload = error.response ? error.response.body : null;
                if (!action.skipTracking) {
                    store.dispatch({ type: ASYNC_END, promise: action.payload });
                }
                store.dispatch(action);
            }
        );

        return;
    }

    next(action);
};


function getCookie(name, text) {
    var cookieValue = null;
    var csrf_token = text.match(/name="csrfmiddlewaretoken" value="(.*)"/);
    if (csrf_token.length === 2) {
        cookieValue = csrf_token[1];
    }
    return cookieValue;
}

const localStorageMiddleware = store => next => action => {
    if (action.type === REQUEST_CSRF) {
        if (!action.error) {
            var csrf_cookie = getCookie('csrftoken', action.payload.text);
            window.localStorage.setItem('csrf', csrf_cookie);
            agent.setCsrf(csrf_cookie);
        }

    } else if (action.type === LOGIN) {
        if (!action.error) {
            window.localStorage.setItem('username', action.payload.req._data.username);
            window.localStorage.setItem('jwt', action.payload.body.token);
            agent.setToken(action.payload.body.token);
        }
    } else if (action.type === REGISTER) {
        if (!action.error) {

        }

    } else if (action.type === LOGOUT || (action.type === SETTINGS_PAGE_UNLOADED && !action.error)) {
        window.localStorage.removeItem('jwt', '');
        window.localStorage.removeItem('username', '');
        agent.setToken(null);
        agent.setCsrf(null);
    }

    next(action);
};

function isPromise(v) {
    return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware }