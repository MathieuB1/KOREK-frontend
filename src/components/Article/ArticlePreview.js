import React from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Badge from 'react-bootstrap/Badge';


const mapDispatchToProps = dispatch => ({
});

const ArticlePreview = props => {

  const article = props.article;

  var subtext = article.text;
  if (subtext && subtext.length > 20) { subtext = article.text.substring(0,20) + '...' }

  const display_style = (props.display_mode === 'grid') ? { 
                                                            display:'inline-grid',
                                                            minWidth:'20rem',
                                                            maxWidth:'20rem',
                                                            minHeight: '27rem',
                                                            maxHeight: '27rem',
                                                            margin: '1rem',
                                                            backgroundColor: '#ffffff',
                                                          } : { display:'block'};
  
  const display_first_image = (props.display_mode === 'grid') ? { margin: 'auto' } : {}

    return (
        <div className="article-preview" style={display_style}>

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
            {(article.subtitle) ? <p>{article.subtitle}</p> : null }

            {(article.videos && article.videos[0]) ?
            <video style={display_first_image} className="first_article_video" key={article.videos[0].video}><source src={article.videos[0].video} /></video> : null }
            {(article.images && article.images[0] && !article.videos[0]) ?
            <img style={display_first_image} className="first_article_image" src={article.images[0].image} alt={article.images[0]} /> : (!article.videos[0]) ? <i className="ion-image"></i> : null }

            { (article.text) ? <p style={{'color':'black'}}>{article.text.replace(/<(?:.|\n)*?>/gm, '').substring(0, 150)}<span>&nbsp;&nbsp;Read more...</span></p> : null }
          </Link>

          { article.title && article.tags && article.tags.length > 0 ? 
          <div><span style={{'color': 'black'}}><i className="ion-bookmark"></i>&nbsp;</span>
            { Object.keys(article.tags).map(key => { return ( 
              <Link key={key} to={`/products_tags/${article.tags[key]}`} className="preview-link">
                <Badge variant="primary">{article.tags[key]}</Badge>
              </Link>
            )}) }
          </div>

          : null }

        </div>
      );

 
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
