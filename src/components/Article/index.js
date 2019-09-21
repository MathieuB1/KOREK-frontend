import ArticleMeta from './ArticleMeta';
import ReadMedia from './ReadMedia';
import React from 'react';
import  agent from '../../agent';
import CommentContainer from '../Comment/CommentContainer';

import { connect } from 'react-redux';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED } from '../../constants/actionTypes';

import Map from './Map';

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser,
  currentUserImage: state.common.currentUserImage
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

class Article extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      locations: []
    };
  }


  componentDidMount() {
    this.props.onLoad(Promise.all([
      agent.Articles.get(this.props.match.params.id),
      agent.Articles.highlight(this.props.match.params.id)
    ]));
  }

  componentDidUpdate(prevProps, prevState) {
   if (this.props.article && this.props.article.locations !== prevState.locations) {
      this.setState({ locations: this.props.article.locations });
    }

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.article) { return null }

    const canModify = this.props.currentUser && this.props.currentUser === this.props.article.owner;
    const htmlEext = { __html: this.props.article.text };

    var locations = [];
    if (this.state.locations.length) {
      locations = this.state.locations.map(key => [{lat: parseFloat(key.coords.split(' ')[2].replace(')','')), lon: parseFloat(key.coords.split(' ')[1].replace('(',''))}] );
    }

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">
            <h1 style={{'color': 'black'}}>{this.props.article.title}</h1>
            <p style={{'color': 'black'}}>{this.props.article.subtitle}</p>
            <ArticleMeta article={this.props.article} canModify={canModify} />
          </div>
        </div>



        <div className="container page">

          <div className="row article-content">
            <div className="col-lg-12">

              <div dangerouslySetInnerHTML={htmlEext}></div>

              {(this.props.article.images.length) ? (<p>Images:</p>) : (<div></div>)}
              { Object.keys(this.props.article.images).map(key => 
                { return ( <ReadMedia key={`image_` + key} type='image' url={this.props.article.images[key].image} /> ) }
              )}

              {(this.props.article.videos.length) ? (<p>Videos:</p>) : (<div></div>)}
              { Object.keys(this.props.article.videos).map(key => 
                { return ( <ReadMedia key={`video_` + key} type='video' url={this.props.article.videos[key].video} /> ) }
              )}

              {(this.props.article.audios.length) ? (<p>Audios:</p>) : null }
              { Object.keys(this.props.article.audios).map(key => 
                { return ( <ReadMedia key={`audio_` + key} type='audio' url={this.props.article.audios[key].audio} /> ) }
              )}

              {(this.props.article.files.length) ? (<p>Files:</p>) : null }
              { Object.keys(this.props.article.files).map(key => 
                { return ( <a key={`file_` + key} href={this.props.article.files[key].file} download><i style={{'font-size':'1.5rem'}} className="ion-android-archive"/></a> ) }
              )}

              {(this.props.article.locations.length) ? (<p>Locations:</p>) : null }
              { (locations.length) ? <Map markerPositions={locations} /> : null }


            </div>
          </div>

          <hr />

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              product_id={this.props.match.params.id}
              product_owner={this.props.article.owner}
              currentUser={this.props.currentUser}
              currentUserImage={this.props.currentUserImage} />
          </div>

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
