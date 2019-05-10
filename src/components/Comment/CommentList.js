import Comment from './Comment';
import React from 'react';

const CommentList = props => {
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
              <div key={comment.id}>
                <Comment
                comment={comment}
                currentUser={props.currentUser}
                product_id={props.product_id}
                product_owner={props.product_owner}
                key={comment.id} />
                <br/>
              </div>
          );
        })
      }
    </div>
  );
};

export default CommentList;