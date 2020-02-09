import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Banner = ({ appName, token }) => {
  if (token) {
    return null;
  }
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">
          {appName.toLowerCase()}
        </h1>
        <p>A place to share your media.</p>


        <div className="container page">
          <div className="row">

            <div className="col-md-3 col-xs-0"></div>

            <div className="banner-button col-md-3 col-xs-12">
              <Link style={{'width':'100%'}} to="/login" className="nav-link">
                <Button style={{'width':'100%', 'height': '4rem'}} variant="light"><i className="ion-log-in"></i>&nbsp;Sign in</Button>
              </Link>
            </div>
            <div className="banner-button col-md-3 col-xs-12">
              <Link style={{'width':'100%'}} to="/register" className="nav-link">
                <Button style={{'width':'100%', 'height': '4rem'}} variant="light"><i className="ion-person"></i>&nbsp;Sign up</Button>
              </Link>
            </div>

            <div className="col-md-3 col-xs-0"></div>

          </div>
        </div>


      </div>
    </div>
  );
};

export default Banner;
