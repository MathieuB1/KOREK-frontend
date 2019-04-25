import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ProfilePreview = props => {
  
    const article = props.article;

    return (
    <div className="article-preview">
            <div className="container page">
              <div className="row">
                  <div className="col-md-1">
                    <img className="user-pic" src={article.image} alt="logo"/>
                  </div>
                  <div className="col-md-11">
                    <Link className="author" to={`/users/${article.profile.user.username}`}>
                    &nbsp;{article.profile.user.username}
                    </Link>
                  </div>
                </div>
            </div>
    </div>
    );
 
}

export default connect(() => ({}))(ProfilePreview);
