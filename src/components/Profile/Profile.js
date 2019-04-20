import ProfileList from './ProfileList';
import AddFriend from './AddFriend';
import ValidateFriend from './ValidateFriend';
import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../../constants/actionTypes';

const EditProfileSettings = props => {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
};

const mapStateToProps = state => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED })
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

  componentDidMount() {
    this.refreshProfile();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentWillReceiveProps(nextProps) {

      if (nextProps.profile.addedFriend) { console.log('pending friend acknowlegment!') }

      if (nextProps.match.params.owner !== this.props.match.params.owner)
      {
          this.setState({ 
            username: nextProps.profile[0].username
          });
          this.refreshProfile(); 
      }

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

    return (
      <div className="profile-page">

        <div className="user-info" style={{'padding': '2rem 0 2rem 0'}}>
          <div className="container">
            <div className="row">
              <div className="col-xs-8 col-md-8 offset-md-2">
                <h5>{profile.first_name}&nbsp;{profile.last_name}</h5>
                <h4>{profile.username}</h4>
              </div>
            </div>
            <EditProfileSettings/>
          </div>
        </div>

        <div className="container">
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
                currentPage={this.props.currentPage} />

        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
