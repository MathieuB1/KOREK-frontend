import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  LOGIN_PAGE_UNLOADED,
  ADD_FRIEND,
  UPDATE_FIELD_FRIEND,
  ADD_FRIEND_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ 
  ...state.profile
  });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) => dispatch({ type: ADD_FRIEND_LOADED, payload }),
  onChangeGroupName: value => dispatch({ type: UPDATE_FIELD_FRIEND, key: 'group_name', value }),
  onSubmit: (group_name, id) => dispatch({ type: ADD_FRIEND, payload: agent.Profile.addGroup(group_name, id) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class AddFriend extends React.Component {
  constructor() {
    super();

    this.state = { 
      id: null, 
      permission: true
    }

  }

  onChangeGroupName = ev => this.props.onChangeGroupName(ev.target.value);
  
  submitForm = (group_name) => ev => {
      ev.preventDefault();
      this.props.onSubmit(group_name, this.state.id);
  }

  componentWillMount() {
    this.props.onLoad(agent.Profile.getGroup());
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.friends) {
        this.setState({ id: nextProps.friends.id, });
      }
      
      if (nextProps.errors && nextProps.errors.detail === 'You do not have permission to perform this action.') {
         this.setState({
            permission: false
        });       
      }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    const group_name = this.props.group_name;

    if (typeof(group_name) === "undefined") { return null }

      return (

        (this.state.permission) ? (
              <div className="container page">
                <div className="row">

                  <div className="col-md-12 col-xs-12">
                    <p>Add a new friend</p>

                    <ListErrors errors={this.props.errors} />

                    <p>{this.props.confirm ? 'Friend has been added!' : ''}</p>

                    <form onSubmit={this.submitForm(group_name)}>

                      <fieldset>
                            <fieldset className="form-group">
                              <input
                                className="form-control"
                                style={{'width':'12rem', 'display':'inline', 'float':'left'}}
                                type="text"
                                value={group_name}
                                placeholder="Username Name"
                                autoComplete="group_name"
                                onChange={this.onChangeGroupName}/>
                              <button
                                className="btn btn-md btn-primary pull-xs-left" style={{'display':'inline'}}
                                type="submit">
                                Add Friend
                              </button>
                            </fieldset>
                      </fieldset>
                      
                    </form>
                  </div>

                </div>
              </div>
        ) : (<div></div>)

      )

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);
