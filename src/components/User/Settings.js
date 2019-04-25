import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  SETTINGS_PAGE_LOADED,
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT
} from '../../constants/actionTypes';

import ImageResize from './ImageResize';


class SettingsForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userPage: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      file: ''
    };

    this.updateImage = this.updateImage.bind(this);

  }

  updateState = field => ev => {
      this.setState({ [field]: ev.target.value });
  }

  submitForm = ev => {
      ev.preventDefault();

      const userpage = this.state.userPage;
      const user = this.state;
      delete user.userPage;
      if (!user.password) { delete user.password; }

      var formData  = new FormData();
      formData.append("first_name",user.first_name);
      formData.append("last_name",user.last_name);
      formData.append("username",user.username);
      formData.append("email",user.email);
      formData.append('file', user.file);
      
      if(user.password) { formData.append("password", user.password); }
      
      // LOGOUT if username or password is changed
      ( (user.username !== this.props.currentUser) || user.password) ? this.props.onSubmitUnload(userpage, formData) : this.props.onSubmitForm(userpage, formData);

  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.setState({ username: this.props.currentUser });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {

      this.setState({
        userPage: nextProps.settings.id,
        username: nextProps.settings.username,
        email: nextProps.settings.email,
        first_name: nextProps.settings.first_name,
        last_name: nextProps.settings.last_name
      });
    }
  }

  updateImage(file) {
    this.setState({ file: file });
  }


  deleteUser = event => {
    this.props.onDeleteUser(this.state.userPage);
  }
  

  render() {

    const first_name = this.state.first_name;
    const last_name = this.state.last_name;
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;

    if (username || email)
    {
    return (
          <div>
            <form onSubmit={this.submitForm}>

                <fieldset className="form-group">
                  <ImageResize updateImage={this.updateImage}/>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="First Name"
                    value={first_name}
                    onChange={this.updateState('first_name')} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={this.updateState('last_name')} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={this.updateState('username')} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.updateState('email')} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    autoComplete="current-password"
                    onChange={this.updateState('password')} />
                </fieldset>

                <fieldset className="form-group">
                    <button
                      className="btn btn-lg btn-primary pull-xs-right" style={{ 'width':'100%' }}
                      type="submit">
                      Update Settings
                    </button>
                </fieldset>

               <hr/>
               <button
                className="btn btn-lg btn-danger pull-xs-left"
                onClick={this.deleteUser}>
                Delete User
               </button>

            </form>
          </div>
        )
    }
    else
    {
      return null;
    }
  }
}


const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) => dispatch({ type: SETTINGS_PAGE_LOADED, payload }),
  onSubmitForm: (id, user) => dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(id, user) }),
  onSubmitUnload: (id, user) => dispatch({ type: SETTINGS_PAGE_UNLOADED, payload: agent.Auth.save(id, user) }),
  onDeleteUser: id => dispatch({ type: LOGOUT, payload: agent.Auth.delete(id) }),
});


class Settings extends React.Component {

  componentDidMount() {
    this.props.onLoad(agent.Profile.register());
  }

  render() {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">

              <h3 className="text-xs-center">Your Settings</h3>

              <ListErrors errors={this.props.errors}></ListErrors>

              <SettingsForm
                currentUser={this.props.currentUser}
                settings={this.props.settings}
                onSubmitForm={this.props.onSubmitForm}
                onSubmitUnload={this.props.onSubmitUnload}
                onDeleteUser={this.props.onDeleteUser}
                 />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
