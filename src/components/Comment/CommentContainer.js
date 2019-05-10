import CommentInput from './CommentInput';
import CommentList from './CommentList';
import React from 'react';
import ListErrors from '../ListErrors';

const CommentContainer = props => {
  if (props.currentUser) {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
          <div className="row">
            <ListErrors errors={props.errors} />
          </div>
          <CommentInput product_id={props.product_id} currentUser={props.currentUser} currentUserImage={props.currentUserImage} />
        </div>
        <br/>
        <CommentList
          comments={props.comments}
          product_id={props.product_id}
          product_owner={props.product_owner}
          currentUser={props.currentUser} />
      </div>
    );
  } else {
    return ( null );
  }
};

export default CommentContainer;