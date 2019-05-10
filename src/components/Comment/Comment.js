import DeleteButton from './DeleteButton';
import { Link } from 'react-router-dom';
import React from 'react';

const Comment = props => {
  const comment = props.comment;
  const show = props.currentUser && (props.currentUser === comment.owner || props.product_owner === props.currentUser);
  return (
    <div className="card comment">
      <div className="card-footer">
        <Link
          to={`/users/${comment.owner}`}
          className="comment-author">
          <img src={comment.owner_image} className="comment-author-img" alt={comment.owner} />
        </Link>
        &nbsp;
        <Link
          to={`/users/${comment.owner}`}
          className="comment-author">
          {comment.owner}
        </Link>
        <span className="date-posted">
          {new Date(comment.created).toDateString()}
        </span>
        <DeleteButton show={show} commentId={comment.id} />
      </div>
      <div className="card-block">
        <p className="card-text">{comment.comment}</p>
      </div>
    </div>
  );
};

export default Comment;