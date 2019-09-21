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
          <div>

            { article.images && article.images.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-android-image"></i>
            { article.images.length > 1 ? ' x' + article.images.length : null }&nbsp;</span></div> : null }

            { article.videos && article.videos.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-videocamera"></i>
            { article.videos.length > 1 ? ' x' + article.videos.length : null }&nbsp;</span></div> : null }

            { article.audios && article.audios.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-headphone"></i>
            { article.audios.length > 1 ? ' x' + article.audios.length : null }&nbsp;</span></div> : null }

            { article.files && article.files.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-android-archive"></i>
            { article.files.length > 1 ? ' x' + article.files.length : null }&nbsp;</span></div> : null }
            
            { article.locations && article.locations.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-android-locate"></i>
            { article.locations.length > 1 ? ' x' + article.locations.length : null }&nbsp;</span></div> : null }

            { article.category && article.category.length > 0 ? 
            <div style={{ 'display': 'inline-block' }} ><span style={{'color': 'black'}}><i className="ion-ios-pricetag"></i>&nbsp;</span>
              { <Link to={`/products_category/${article.category}`} className="preview-link">
                  <Badge variant="secondary">{article.category}</Badge>
                </Link> }
            </div> : null }

            { article.tags && article.tags.length > 0 ? 
            <div style={{ 'display': 'inline-block' }}><span style={{'color': 'black'}}><i className="ion-bookmark"></i>&nbsp;</span>
              { Object.keys(article.tags).map(key => { return ( 
                <Link key={key} to={`/products_tags/${article.tags[key]}`} className="preview-link">
                  <Badge variant="primary">{article.tags[key]}</Badge>
                </Link>
              )}) }
            </div> : null }

          </div>

        </div>
      );

 
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
