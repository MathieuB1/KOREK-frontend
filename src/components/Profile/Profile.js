import ProfileList from './ProfileList';
import AddFriend from './AddFriend';
import ValidateFriend from './ValidateFriend';
import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';

import Media from 'react-bootstrap/Media';
import Badge from 'react-bootstrap/Badge';


import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  DELETE_FRIEND
} from '../../constants/actionTypes';


const ShowMyArticles = props => {
    return (
      <Link style={{'width':'9rem'}}
        to={`/users/${props.username}`}
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-android-list"></i> My Articles&nbsp;{props.total}
      </Link>
    );
};

const EditProfileSettings = props => {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit My Profile
      </Link>
    );
};



const mapStateToProps = state => ({
  ...state.articleList,
  currentUserImage: state.common.currentUserImage,
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
  onClickDeleteFriend: payload => dispatch({ type: DELETE_FRIEND, payload })
});

class Profile extends React.Component {
  constructor() {
  super();

    this.state = {
      username : '',
      deleted : []
    }

    this.refreshProfile = this.refreshProfile.bind(this);

  }

  refreshProfile () 
  {
    this.props.onLoad(Promise.all([
      agent.Profile.register(),
      agent.Profile.profiles()
    ]));
  }

  componentWillMount() {
    this.refreshProfile();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }


  componentWillReceiveProps(nextProps) {

      if (nextProps.match.params.owner !== this.props.match.params.owner)
      {
          this.setState({ 
            username: nextProps.profile[0].username
          });
          this.refreshProfile(); 
      }

      if (nextProps.profile.deletedFriend) { this.refreshProfile() }

  }


  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className={ 'nav-link active' }
            to={`/users/`}>
            { 'My Friends' }
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const profile = this.props.profile[0];
    if (!profile) {  return null; }

    const profile_stats = (this.props.articles && this.props.currentUser) ? this.props.articles.filter(el => this.props.currentUser === el.profile.user.username).map(article => { return article }) : null

    return (
      <div className="container">

        <div className="container page">
            
              <Media className="edit-profile">
              <img width={55}
                  height={55}
                  style={{ borderRadius:'50px' }}
                  className="mr-3" src={this.props.currentUserImage} alt={profile.username}/>
                <Media.Body>
                    <h4>{profile.username}</h4>
                    <h5>{profile.first_name}&nbsp;{profile.last_name}</h5>
                </Media.Body>
              </Media>

              <div className="edit-profile">
                <ShowMyArticles username={profile.username} total={profile_stats ? profile_stats[0].products : 0} />
                <EditProfileSettings/>
              </div>

              <br/>
              
              { profile_stats && profile_stats[0].tags.length > 0 ?
              <div className="scrolling-wrapper">{profile_stats[0].tags.filter(el => el.tags__name).map(el => {
                return  (
                  <Link className="category" key={el.tags__name} to={`/products_tags/${el.tags__name}`} >
                     <Badge key={el.tags__name} style={{'margin':'1px','padding':'1px'}} className="btn" variant="primary">
                       {el.tags__name}&nbsp;
                       <Badge variant="dark">{el.total}</Badge>
                     </Badge>
                  </Link>
                )
              })}</div>
              : null }

        </div>

        <ValidateFriend refreshProfile={this.refreshProfile}/>
        <AddFriend/>

        <div className="articles-toggle">
          {this.renderTabs()}
        </div>

        <ProfileList
          pager={this.props.pager}
          articles={this.props.articles}
          currentUser={this.props.currentUser}
          loading={this.props.loading}
          articlesCount={this.props.articlesCount}
          currentPage={this.props.currentPage}
          onClickDeleteFriend={this.props.onClickDeleteFriend} />

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
