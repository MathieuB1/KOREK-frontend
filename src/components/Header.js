import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavDropdown  } from 'react-bootstrap';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (

      <ul className="nav navbar-nav ml-auto pull-md-right">

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            <i className="ion-log-in"></i>&nbsp;Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
            <i className="ion-person"></i>&nbsp;Sign up
          </Link>
        </li>

      </ul>

    );
  }
  return null;
};

const LoggedInView = props => {

  if (props.currentUser) {
    
    return (


      <ul className="nav navbar-nav ml-auto pull-md-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="ion-home"></i>&nbsp;Home
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

      <NavDropdown title={<img src={props.currentUserImage} className="user-pic" alt={props.currentUser} />} id="basic-nav-dropdown">

        <li className="nav-item">
          <Link to={`/settings/`} className="nav-link">
              <i className="ion-gear-a"></i>&nbsp;My Settings
          </Link>
        </li>

        <NavDropdown.Divider />
        
        <li className="nav-item">
          <button className="btn btn-danger btn-sm nav-link" style={{ 'color': 'white', 'width': '100%' }} onClick={props.onClickLogout}>
            <i className="ion-log-out"></i>&nbsp;Logout
          </button>
        </li>

      </NavDropdown>


      </ul>

    );
  }

  return null;
};

class Header extends React.Component {

  render() {

    return (
      
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <LoggedOutView currentUser={this.props.currentUser} />
          <LoggedInView currentUser={this.props.currentUser} currentUserImage={this.props.currentUserImage} 
                        onClickLogout={this.props.onClickLogout} />

        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;