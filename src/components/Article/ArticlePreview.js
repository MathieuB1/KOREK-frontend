import React from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
});

const ArticlePreview = props => {

  const article = props.article;

  var subtext = article.text;
  if (subtext && subtext.length > 20) { subtext = article.text.substring(0,20) + '...' }

    return (
        <div className="article-preview">

          <div className="article-meta">

            <div className="info" style={{ marginRight: '0.5rem'}}>
               {<img src={article.owner_image} alt={article.owner} />}
              <Link className="author" to={`/users/${article.owner}`}>
                &nbsp;{article.owner}
              </Link>
              <span className="date">
                {new Date(article.created).toDateString()}
              </span>
              {(article.private) ? <i className="ion-locked" style={{'color': '#ea0000'}}></i> : null}
            </div>
          </div>

          <Link to={`/products/${article.id}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.subtitle}</p>
            {(article.images && article.images[0]) ?
            <img className="first_article_image" src={article.images[0].image} alt={article.images[0]} /> : null }
            <span>Read more...</span>
            <ul className="tag-list">
              {article.url}
            </ul>
          </Link>
        </div>
      );

 
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
