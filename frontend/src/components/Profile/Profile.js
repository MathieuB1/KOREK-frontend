import ProfileList from './ProfileList';
import AddFriend from './AddFriend';
import ValidateFriend from './ValidateFriend';
import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import { store } from '../../store';
import { push } from 'react-router-redux';

import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  DELETE_FRIEND,
  REDIRECT
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
  ...state.profile,
  currentUserImage: state.common.currentUserImage,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
  onClickDeleteFriend: payload => dispatch({ type: DELETE_FRIEND, payload }),
  onRedirect: () =>  dispatch({ type: REDIRECT })
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


  componentDidUpdate(prevProps, prevState) {

    // redirect to home page in case of error
    if (this.props.redirectTo && this.props.redirectTo !== prevProps.redirectTo) {
        store.dispatch(push(this.props.redirectTo));
        this.props.onRedirect();
    }

      if (this.props.profile && this.props.profile !== prevProps.profile)
      {
          this.setState({ username: this.props.profile.username });
      }

      if (this.props.deletedFriend) { this.refreshProfile() }

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
    const profile = this.props.profile;
    if (!profile) {  return null; }

    const profile_stats = (this.props.articles && this.props.currentUser) ? this.props.articles.filter(el => this.props.currentUser === el.profile.user.username).map(article => { return article }) : null

    return (
      <div className="container">

        <div className="container page">
            
              <Card className="edit-profile" style={{ 'border': '0px'}}>
              <Card.Img  variant="top"
                  style={{ borderRadius:'50px', width:'55px', height:'55px', margin:'auto', display:'block' }}
                  src={this.props.currentUserImage} alt={profile.username}/>
                <Card.Body>
                  <Card.Title>{profile.username}</Card.Title>
                  <Card.Text>{profile.first_name}&nbsp;{profile.last_name}</Card.Text>
                </Card.Body>
              </Card>

              <div className="edit-profile">
                { profile_stats && profile_stats[0] && profile_stats[0].products ?
                <ShowMyArticles username={profile.username} total={ profile_stats[0].products } />
                : null }
                <EditProfileSettings/>
              </div>

              <br/>

              { profile_stats && profile_stats[0] && profile_stats[0].categories.length > 0 ?
              <span>Categories:<div className="scrolling-wrapper">{profile_stats[0].categories.filter(el => el.category__name).map(el => {
                return  (
                  <Link className="category" key={el.category__name} to={`/products_category_owner/${el.category__name}/${profile.username}`} >
                     <Badge key={el.tags__name} style={{'margin':'1px','padding':'1px'}} className="btn" variant="secondary">
                       {el.category__name}&nbsp;
                       <Badge variant="dark">{el.total}</Badge>
                     </Badge>
                  </Link>
                )
              })}</div></span>
              : null }
              
              { profile_stats && profile_stats[0] && profile_stats[0].tags.length > 0 ?
              <span>Tags:<div className="scrolling-wrapper">{profile_stats[0].tags.filter(el => el.tags__name).map(el => {
                return  (
                  <Link className="tag" key={el.tags__name} to={`/products_tag_owner/${el.tags__name}/${profile.username}`} >
                     <Badge key={el.tags__name} style={{'margin':'1px','padding':'1px'}} className="btn" variant="primary">
                       {el.tags__name}&nbsp;
                       <Badge variant="dark">{el.total}</Badge>
                     </Badge>
                  </Link>
                )
              })}</div></span>
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
