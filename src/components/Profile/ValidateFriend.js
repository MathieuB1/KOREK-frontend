import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  LOAD_ASKER_FRIENDS,
  VALIDATE_ASKER
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state.friend });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) => dispatch({ type: LOAD_ASKER_FRIENDS, payload }),
  onValidate: (id, val) => dispatch({ type: VALIDATE_ASKER, payload: agent.Profile.validateFriend(id, val) }),
});

class ValidateFriend extends React.Component {
  constructor() {
    super();

    this.state = { 
      list_to_validate: [], 
      permission: true 
    };
  }


  componentWillMount() {
    this.props.onLoad(agent.Profile.getAcknowlegment());
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.validate) {

        // Remove validated friend from list
        const data = this.state.list_to_validate.filter(i => i.id !== nextProps.users_to_validate.id );
        this.setState({ list_to_validate: data });

        this.props.refreshProfile();

      } 
      if (!nextProps.validate && nextProps.users_to_validate.length > 0) {
        this.setState({
            list_to_validate: nextProps.users_to_validate,
        });
      }
      
      if (nextProps.errors && nextProps.errors.detail === 'You do not have permission to perform this action.') {
        this.setState({
            permission: false
        });
      }
  }

  render() {

  const add = (id) => {
    this.props.onValidate(id, true)
  };
  const del = (id) => {
    this.props.onValidate(id, false)
  };

  if (this.state.permission)
  {
    return (
          <div className="container page">
          <div className="row">

              <div className="col-md-12 col-xs-12">
              <p>{ this.state.list_to_validate.length ? 'Validate friends' : ''}</p>

              <ListErrors errors={this.props.errors} />
              <p>{this.props.confirm ? 'Friend has been added!' : ''}</p>

              {this.state.list_to_validate.map(key => { return (
                  <div key={key} className="row">
                      <div className="col-md-4 col-xs-4">
                          <p>{key.group_asker_username}</p>
                      </div>
                      <div className="col-md-8 col-xs-8">
                          <a className="btn btn-sm btn-outline-primary action-btn" onClick={add.bind(this, key.id)}><i className="ion-android-add-circle"></i>&nbsp;accept</a>
                          <a className="btn btn-sm btn-outline-danger action-btn" onClick={del.bind(this, key.id)}><i className="ion-android-remove-circle"></i>&nbsp;reject</a>
                      </div>
                  </div>

                  )})}

              </div>

          </div>
          </div>
        )
    } 
    else { return null; }

  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateFriend);
