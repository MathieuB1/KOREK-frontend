import ArticleMeta from './ArticleMeta';
import ReadMedia from './ReadMedia';
import React from 'react';
import  agent from '../../agent';
import CommentContainer from '../Comment/CommentContainer';
import { store } from '../../store';
import { push } from 'react-router-redux';

import { connect } from 'react-redux';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED, REDIRECT } from '../../constants/actionTypes';

import Map from './Map';

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser,
  currentUserImage: state.common.currentUserImage,
  websocket: state.websocket
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload => dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ARTICLE_PAGE_UNLOADED }),
  onRedirect: () => dispatch({ type: REDIRECT }),
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

    // redirect to home page in case of error
    if (this.props.redirectTo && this.props.redirectTo !== prevProps.redirectTo) {
        store.dispatch(push(this.props.redirectTo));
        this.props.onRedirect();
    }

    if (this.props.article && this.props.article.locations !== prevState.locations) {
      this.setState({ locations: this.props.article.locations });
    }

   // if we have an update from websocket then we refresh the page
   if(this.props.article && this.props.websocket && Number(this.props.websocket.product_id) === this.props.article.id ) {
      // consume the message
      this.props.websocket.last_consumed_message = this.props.websocket.message;
      this.props.websocket.message = '';
      this.props.websocket.product_id = '';
      
      this.props.onLoad(Promise.all([
        agent.Articles.get(this.props.match.params.id),
        agent.Articles.highlight(this.props.match.params.id)
      ]));
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

              {(this.props.article.files.length) ? (<p>PDFs:</p>) : null }
              { Object.keys(this.props.article.files).map(key => { 
                  if (this.props.article.files[key].file.split('.').pop() === 'pdf') {
                    return (  <ReadMedia key={`pdf_` + key} type='pdf' url={this.props.article.files[key].file} /> ) 
                  } else {
                    return null;
                  }
                }
              )}

              {(this.props.article.files.length) ? (<p>Files:</p>) : null }
              { Object.keys(this.props.article.files).map(key => 
                { return (  <ReadMedia key={`file_` + key} type='file' url={this.props.article.files[key].file} /> ) }
              )}
              
              {(this.props.article.locations.length) ? (<span><p>Locations:</p>
              <div>Positions: {this.props.article.locations.length}</div>
              <div>Snap Time: {this.props.article.locations[this.props.article.locations.length-1].created.split('.')[0].split('T')[1]}</div>
              <div>Trip length: {this.props.article.locations_distance} m</div>
              <span>Lon Lat: {this.props.article.locations[this.props.article.locations.length-1].coords.split(';')[1].replace('POINT (','').replace(')','')}</span></span>) 
              : null }
              { (locations.length) ? <Map key={this.props.article.id} markerPositions={locations} /> : null }


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
