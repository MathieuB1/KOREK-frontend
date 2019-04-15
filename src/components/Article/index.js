import ArticleMeta from './ArticleMeta';
import ReadMedia from './ReadMedia';
import React from 'react';
import  agent from '../../agent';
import { connect } from 'react-redux';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

class Article extends React.Component {
  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Articles.get(this.props.match.params.id),
      agent.Articles.highlight(this.props.match.params.id)
    ]));
  
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.article) { return null }

    const canModify = this.props.currentUser && this.props.currentUser === this.props.article.owner;

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.article.title}</h1>
            <ArticleMeta article={this.props.article} canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">
              <p>{this.props.article.subtitle}</p>
              <p style={{'white-space': 'pre-line'}}>{this.props.article.text}</p>

              {(this.props.article.images.length) ? (<p>Images:</p>) : (<div></div>)}
              { Object.keys(this.props.article.images).map(key => 
                { return ( <ReadMedia key={`image_` + key} type='image' url={this.props.article.images[key].image} /> ) }
              )}

              {(this.props.article.videos.length) ? (<p>Videos:</p>) : (<div></div>)}
              { Object.keys(this.props.article.videos).map(key => 
                { return ( <ReadMedia key={`video_` + key} type='video' url={this.props.article.videos[key].video} /> ) }
              )}

              {(this.props.article.audios.length) ? (<p>Audios:</p>) : (<div></div>)}
              { Object.keys(this.props.article.audios).map(key => 
                { return ( <ReadMedia key={`audio_` + key} type='audio' url={this.props.article.audios[key].audio} /> ) }
              )}
            </div>
          </div>

          <hr />

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
