import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';
import {
    CLEAR_TOKEN
} from '../constants/actionTypes';

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    _clearToken: () => dispatch({ type: CLEAR_TOKEN, payload: agent.Auth.current() }),
});


class ListErrors extends React.Component {

  clearToken = () => {
    this.props._clearToken();
  }

  render() {
    const errors = this.props.errors;
    if (errors) {
      if (errors.detail === "Signature has expired.") {
        this.clearToken()
      }

      return (
        <ul className="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <li key={key}>
                  {key} : {errors[key]}
                </li>
              );
            })
          }
        </ul>
      );
    } else {
      return null;
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ListErrors);