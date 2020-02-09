import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ 
  ...state.auth,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (username, password) => dispatch({ type: LOGIN, payload: agent.Auth.login(username, password) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        username: window.localStorage.getItem('username')  ? window.localStorage.getItem('username') : '',
        password: '',
    };

  }

  submitForm = () => ev => {
    ev.preventDefault();
    this.props.onSubmit(this.state.username, this.state.password);
  };

  updateState = field => ev => {
      this.setState({ [field]: ev.target.value });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }


  render() {
    const username = this.state.username;
    const password = this.state.password;;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={username}
                      autoComplete="username"
                      onChange={this.updateState('username')} required/>
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
                    Sign in
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
