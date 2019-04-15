import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {

  if (props.currentUser) {

    // Load WebSocket
    if (!props.loadedWebSocket)
    {
      props.loadWebSocket();
    }
    
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/users/" className="nav-link">
            <i className="ion-person"></i>&nbsp;My Profile
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to={`/settings/`}
            className="nav-link">
            <img src={props.currentUserImage} className="user-pic" alt={props.currentUser} />
            {props.currentUser.username}
          </Link>
        </li>

        <li className="nav-item">
          <button className="btn btn-outline-danger btn-sm nav-link" style={{ marginTop:'0.125rem'}} onClick={props.onClickLogout}>
            <i className="ion-log-out"></i>&nbsp;Logout
          </button>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>
        
          <LoggedOutView currentUser={this.props.currentUser} />
          <LoggedInView currentUser={this.props.currentUser} currentUserImage={this.props.currentUserImage} 
                        onClickLogout={this.props.onClickLogout} loadWebSocket={this.props.loadWebSocket} loadedWebSocket={this.props.loadedWebSocket}  />

        </div>
      </nav>
    );
  }
}

export default Header;
