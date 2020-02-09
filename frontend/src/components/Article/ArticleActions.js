import { Link } from 'react-router-dom';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_ARTICLE } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onClickDelete: payload => dispatch({ type: DELETE_ARTICLE, payload })
});

const ArticleActions = props => {
  const article = props.article;
  const del = () => { props.onClickDelete(agent.Articles.del(article.id)) };

  if (props.canModify) {
    return (
      <div>

        <Link style={{'color': 'black'}}
          to={`/editor/${article.id}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>

        <button style={{'color': 'black', 'display':'inline-flex'}} className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Delete Article
        </button>

      </div>
    );
  } else { return null; }
  
};

export default connect(() => ({}), mapDispatchToProps)(ArticleActions);
