import ArticleActions from './ArticleActions';
import { Link } from 'react-router-dom';
import React from 'react';

const ArticleMeta = props => {
  const article = props.article;
  return (
    <div className="article-meta">
      <Link to={`/settings/`}>
         {<img src={article.owner_image} alt={article.owner} />}
      </Link>

      <div className="info" style={{ marginRight: '0.5rem'}}>
        <Link style={{'color': 'black'}} to={`/users/${article.owner}`} className="author">
          {article.owner}
        </Link>
        <span className="date" style={{'color': 'black'}}>
          {new Date(article.created).toDateString()}
        </span>
        {(article.private) ? <i className="ion-locked" style={{'color': '#ea0000'}}></i> : null}
      </div>

      <ArticleActions canModify={props.canModify} article={article} />
    </div>
  );
};

export default ArticleMeta;
