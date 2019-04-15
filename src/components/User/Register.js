import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../../constants/actionTypes';

import ImageResize from './ImageResize';


const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onSubmit: user => {
    const payload = agent.Auth.register(user);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED })
});



class Register extends React.Component {
  constructor() {
    super();
    this.state = {
        file: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
    };

    this.updateImage = this.updateImage.bind(this);
  }

  submitForm = () => ev => {
      ev.preventDefault();

      var formData  = new FormData();

      formData.append("first_name", this.state.first_name);
      formData.append("last_name", this.state.last_name);
      formData.append("username", this.state.username);
      formData.append("email", this.state.email);
      formData.append("password", this.state.password);
      formData.append("file", this.state.file);    

      this.props.onSubmit(formData);
  }

  updateState = field => ev => {
      this.setState({ [field]: ev.target.value });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updateImage(file) {
      this.setState({ file: file });
  }

  render() {

    const email = this.state.email;
    const password = this.state.password;
    const username = this.state.username;
    const first_name = this.state.first_name;
    const last_name = this.state.last_name;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm()}>
                <fieldset>

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
                      placeholder="Password"
                      value={password}
                      autoComplete="current-password"
                      onChange={this.updateState('password')} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Sign up
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
