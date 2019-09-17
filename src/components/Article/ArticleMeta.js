import ArticleActions from './ArticleActions';
import { Link } from 'react-router-dom';
import React from 'react';
import Badge from 'react-bootstrap/Badge';

const ArticleMeta = props => {
  const article = props.article;
  return (
    <div className="article-meta">
      <Link to={`/settings/`}>
         {<img src={article.owner_image} alt={article.owner} />}
      </Link>

      <div className="info">
        <Link style={{'color': 'black'}} to={`/users/${article.owner}`} className="author">
          {article.owner}
        </Link>
        <span className="date" style={{'color': 'black'}}>
          {new Date(article.created).toDateString()}
        </span>
        {(article.private) ? <i className="ion-locked" style={{'color': '#ea0000'}}></i> : null}
      </div>


      { article.category && article.category.length > 0 ? 
      <div style={{ 'display': 'inline-block' }} ><span style={{'color': 'black'}}><i className="ion-ios-pricetag"></i>&nbsp;</span>
        { <Link to={`/products_category/${article.category}`} className="preview-link">
            <Badge variant="secondary">{article.category}</Badge>
          </Link> }
      </div> : null }

      { article.tags && article.tags.length > 0 ? 
      
      <div><span style={{'color': 'black'}}><i className="ion-bookmark"></i>&nbsp;</span>
        { Object.keys(article.tags).map(key => { return ( 
          <Link key={key} to={`/products_tags/${article.tags[key]}`} className="preview-link"><Badge variant="primary">{article.tags[key]}</Badge></Link>
        )}) }
      </div>

      : null }

      <ArticleActions canModify={props.canModify} article={article} />
    </div>
  );
};

export default ArticleMeta;
