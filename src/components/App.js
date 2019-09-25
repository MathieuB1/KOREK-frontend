import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { REQUEST_CSRF, APP_LOAD, REDIRECT, LOGOUT, IMAGE_LOAD } from '../constants/actionTypes';
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

class App extends React.Component {

    constructor() {
        super();
        this.state = { 
            loadedWebSocket: false,
            loadFailure: false
         }
    }


    loadWebSocket() {

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
        throw new Error('WebSocket network response was not ok.');
        })
        .then(function(text) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = text;
            document.getElementsByTagName("head")[0].appendChild(script);
        })

        this.setState({ loadedWebSocket: true });
        
    }


    componentDidUpdate(prevProps, prevState) {

        if (this.props.redirectTo && this.props.redirectTo !== prevProps.redirectTo) {
            store.dispatch(push(this.props.redirectTo));
            this.props.onRedirect();
        }
        
        if (this.props.errors && this.props.errors !== prevProps.errors && !this.state.loadFailure) {
            this.props.onClickLogout();
            this.setState({ loadFailure: true });
        }

        if(this.props.currentUser && this.props.currentUser !== prevProps.currentUser && this.props.currentUser && !this.props.currentUserImage && !this.props.currentUserImage) {
            this.props.onLoadUserPicture(agent.Profile.byAuthor(this.props.currentUser));
        }

        if(this.props.currentUser && this.props.currentUser && !this.state.loadedWebSocket)
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
                <Route path = "/products_tags/:tag" component = { Tag }/> 
                <Route path = "/products_category/:category" component = { Category }/> 
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