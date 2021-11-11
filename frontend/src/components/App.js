import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { REQUEST_CSRF, APP_LOAD, REDIRECT, LOGOUT, IMAGE_LOAD, WS_RECEIVED_MESSAGE } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import Article from '../components/Article';
import Tag from '../components/Tag';
import Category from '../components/Category';
import Editor from '../components/Article/Editor';
import Home from '../components/Home';
import Login from '../components/User/Login';
import Register from '../components/User/Register';
import Settings from '../components/User/Settings';
import Profile from '../components/Profile/Profile';
import Friend from '../components/Profile/Friend';
import { store } from '../store';
import { push } from 'react-router-redux';



const mapStateToProps = state => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        currentUser: state.common.currentUser,
        currentUserImage: state.common.currentUserImage,
        redirectTo: state.common.redirectTo,
        errors: state.common.errors
    }
};

const mapDispatchToProps = dispatch => ({
    onCsrfRequest: (payload, csrf) => dispatch({ type: REQUEST_CSRF, payload, csrf, skipTracking: true }),
    onLoad: (payload, token, username) => dispatch({ type: APP_LOAD, payload, token, username, skipTracking: true }),
    onLoadUserPicture: (payload) => dispatch({ type: IMAGE_LOAD, payload, skipTracking: true }),
    onRedirect: () => dispatch({ type: REDIRECT }),
    onClickLogout: () => dispatch({ type: LOGOUT }),
});


// Open the websocket
var wsStart = window.localStorage.getItem('API_ROOT').split("//")[0] === "https:" ? 'wss://' : 'ws://';
var ws = new WebSocket(wsStart + window.localStorage.getItem('API_ROOT').split("//")[1] + 
                        '/ws/event/' + window.localStorage.getItem('username') + '/', 
                        window.localStorage.getItem('jwt'));

                        
class App extends React.Component {

    constructor() {
        super();
        this.state = { 
            loadedWebSocket: false,
            loadFailure: false
         }
    }


    loadWebSocket() {

        if (window.localStorage.getItem('username') != null && 
        window.localStorage.getItem('API_ROOT') != null && 
        window.localStorage.getItem('jwt') != null) {

            // 1st websocket
            // Used for Redux Storage
            var timeout = 250;
            var connectInterval;

            // websocket onopen event listener
            ws.onopen = () => {
                console.log("connected websocket main component");
                timeout = 250; // reset timer to 250 on open of websocket connection 
                clearTimeout(connectInterval); // clear Interval on on open of websocket connection
            }

            // websocket onclose event listener
            ws.onclose = e => {
                console.log(
                    `Socket is closed. Reconnect will be attempted in ${Math.min(
                        10000 / 1000,
                        (timeout + timeout) / 1000
                    )} second.`,
                    e.reason
                );
                timeout = timeout + timeout; //increment retry interval
                connectInterval = setTimeout(this.check, Math.min(10000, timeout)); //call check function after timeout
            };

            // websocket onerror event listener
            ws.onerror = err => {
                console.error(
                    "Socket encountered error: ",
                    err.message,
                    "Closing socket"
                );
                ws.close();
            };

            ws.onmessage = evt => {
                // listen to data sent from the websocket server
                const message = JSON.parse(evt.data)
                const action = { type: WS_RECEIVED_MESSAGE, message }
                store.dispatch(action);
            }
            

            // Used for Notifier (can be desactivated & no retry!)
            // 2nd websocket 
            fetch(window.localStorage.getItem('API_ROOT') + '/event/notif/', { 
            method: 'GET',  
            headers: new Headers({
                'Authorization': 'Bearer '+  window.localStorage.getItem('jwt'), 
            }), 
            })
            .then(function(response) {
            if(response.ok) {
                return response.text();
            }
            console.log('WebSocket network response was not ok.');
            })
            .then(function(text) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.text = text;
                document.getElementsByTagName("head")[0].appendChild(script);
            })

            this.setState({ loadedWebSocket: true });

        }
        
    }
    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
    */
    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.loadWebSocket(); //check if websocket instance is closed, if so call `connect` function.
    };



    componentDidUpdate(prevProps, prevState) {

        if (this.props.redirectTo && this.props.redirectTo !== prevProps.redirectTo) {
            store.dispatch(push(this.props.redirectTo));
            this.props.onRedirect();
        }
        
        if (this.props.errors && this.props.errors !== prevProps.errors && !this.state.loadFailure) {
            this.props.onClickLogout();
            this.setState({ loadFailure: true });
        }

        if(this.props.currentUser && this.props.currentUser !== prevProps.currentUser && !this.props.currentUserImage) {
            this.props.onLoadUserPicture(agent.Profile.byAuthor(this.props.currentUser));
        }

        if(this.props.currentUser && !this.state.loadedWebSocket)
        {
            this.loadWebSocket();
        }
    }


    onUnload(event) {
        window.eventSocket.onclose();
    }

    componentDidMount() {

        const csrf = window.localStorage.getItem('csrf');
        if (csrf) {
            agent.setCsrf(csrf);
        }
        this.props.onCsrfRequest(agent.Auth.get_csrf(), csrf);

        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }

        const username = window.localStorage.getItem('username');
        this.props.onLoad(token ? agent.Auth.current() : null, token, username);

        window.addEventListener("beforeunload", this.onUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }

    render() {
    
        if (this.props.appLoaded) {
            return ( <div >
                <Header appName={this.props.appName} currentUser={this.props.currentUser} currentUserImage={this.props.currentUserImage} onClickLogout={this.props.onClickLogout}/> 
                <Switch >
                <Route exact path = "/" component = { Home }/> 
                <Route path = "/login" component = { Login }/> 
                <Route path = "/register" component = { Register } /> 
                <Route path = "/editor/:id" component = { Editor }/> 
                <Route path = "/editor" component = { Editor } /> 
                <Route path = "/products/:id" component = { Article }/>
                <Route path = "/products_tag/:tag" component = { Tag }/> 
                <Route path = "/products_category/:category" component = { Category }/>
                <Route path = "/products_tag_owner/:tag/:owner" component = { Tag }/> 
                <Route path = "/products_category_owner/:category/:owner" component = { Category }/> 
                <Route path = "/users/:owner" component = { Friend }/> 
                <Route path = "/users/" component = { Profile }/> 
                <Route path = "/settings" component = { Settings } />
                </Switch>
                </div>

            );
        }
        return (<div><Header appName={ this.props.appName } currentUser={ this.props.currentUser }/></div>);

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);