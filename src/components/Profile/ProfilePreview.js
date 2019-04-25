import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import agent from '../../agent';

const ProfilePreview = props => {
  
    const article = props.article;
    const del = () => { props.onClickDeleteFriend(agent.Profile.delete(article.id)) };

    return (
      <div className="article-preview">
              <div className="container page">
                <div className="row">
                    <div className="col-md-1">
                      <img className="user-pic" src={article.image} alt="logo"/>
                    </div>
                    <div className="col-md-10">
                      <Link className="author" to={`/users/${article.profile.user.username}`}>
                      &nbsp;{article.profile.user.username}
                      </Link>
                    </div>

                    <div className="col-md-1">
                      <button
                        className="btn btn-md pull-xs-right btn-danger"
                        type="button"
                        onClick={del}>
                        <i className="ion-trash-a"></i> Delete Friend
                      </button>
                    </div>

                  </div>
              </div>
      </div>
    );
 
}

export default connect(() => ({}))(ProfilePreview);
