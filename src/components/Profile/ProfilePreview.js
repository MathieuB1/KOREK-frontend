import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ProfilePreview = props => {
  
    const article = props.article;

    return (
    <div className="article-preview">
            <div className="container page">
              <div className="row">
                  <div className="col-md-3 col-xs-3">
                    <img style={{ borderRadius: '50px' }} src={article.image} alt="logo"/>
                  </div>
                  <div className="col-md-9 col-xs-9">
                    <Link className="author" to={`/users/${article.profile.user.username}`}>
                    {article.profile.user.username}
                    </Link>
                  </div>
                </div>
            </div>
    </div>
    );
 
}

export default connect(() => ({}))(ProfilePreview);
