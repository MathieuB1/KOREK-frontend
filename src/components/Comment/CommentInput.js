import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { ADD_COMMENT } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onSubmit: payload =>
    dispatch({ type: ADD_COMMENT, payload })
});

class CommentInput extends React.Component {
  constructor() {
    super();
    this.state = {
      body: ''
    };

    this.setBody = ev => {
      this.setState({ body: ev.target.value });
    };

    this.createComment = ev => {
      ev.preventDefault();
      const args = {product: this.props.product_id, comment: this.state.body};
      const payload = agent.Comments.create(args);
      this.setState({ body: '' });
      this.props.onSubmit(payload);
    };
  }

  render() {
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="3">
          </textarea>
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUserImage}
            className="comment-author-img"
            alt={this.props.currentUser} />
            <div className="comment-author">
            &nbsp;{this.props.currentUser}
            </div>
          <button
            className="btn btn-sm btn-primary"
            type="submit">
            Comment
          </button>
        </div>
      </form>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(CommentInput);