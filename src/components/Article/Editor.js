import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';
import './dropzone.css';
import ReadMedia from './ReadMedia';

import { Line } from 'rc-progress';

import {
  EDITOR_PAGE_LOADED,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR,
  DELETE_MEDIA
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onSubmit: payload =>
    dispatch({ type: ARTICLE_SUBMITTED, payload }),
  onUnload: payload =>
    dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value }),
  onDeleteMedia: payload =>
    dispatch({ type: DELETE_MEDIA, payload })
});

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      files: [],
      deleted_images: [],
      deleted_videos: [],
      deleted_audios: []
    }


    this.submitForm = ev => {
      ev.preventDefault();

      var formData  = new FormData();
      formData.append("title",this.props.title);
      formData.append("subtitle",this.props.subtitle);
      formData.append("text",this.props.text);
      this.state.files.map( (file, index) => formData.append(`file${index}`,this.state.files[index]));

      const id = { id: this.props.articleid };
      const promise = this.props.articleid ?
        agent.Articles.update(Object.assign(formData, id)) :
        agent.Articles.create(formData);

      this.props.onSubmit(promise);
    };


  }

  deleteMedia = (key, type) => ev => {
      const item_to_remove = type; //images_url, videos_url, audios_url

      var data = { "id": this.props.match.params.id,
                   "title": this.props.title,
                   "text": this.props.text }

      data[item_to_remove] = [key];
      this.props.onDeleteMedia(agent.Articles.delete_media(data));
    }

  updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);

  componentDidMount() {
    if (this.props.match.params.id) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.id));
    }
    this.props.onLoad(null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deleted) {
        // hide the component
        if(nextProps.media_deleted.images_url) { this.setState({ deleted_images: this.state.deleted_images.concat(nextProps.media_deleted.images_url) }) }
        if(nextProps.media_deleted.videos_url) { this.setState({ deleted_videos: this.state.deleted_videos.concat(nextProps.media_deleted.videos_url) }) }
        if(nextProps.media_deleted.audios_url) { this.setState({ deleted_audios: this.state.deleted_audios.concat(nextProps.media_deleted.audios_url) }) }
    }


    if (this.props.match.params.id !== nextProps.match.params.id) {
      if (nextProps.match.params.id) {
        this.props.onUnload();
        return this.props.onLoad(agent.Articles.get(nextProps.match.params.id));
      }
      this.props.onLoad(null);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  removeFile(file) {
    this.setState({ files: this.state.files.filter( el => el.upload.uuid !== file.upload.uuid ) });
  }

  render() {
    
    var componentConfig = { showFiletypeIcon: true, postUrl: 'no-url' };
    var djsConfig = { maxFilesize: 4096, addRemoveLinks: true, autoProcessQueue: false }
    var eventHandlers = { 
      addedfile: (file) => this.setState({ files: this.state.files.concat(file) }),
      removedfile: (file) => this.removeFile(file)
    }

    if (typeof(this.props.title) !== "undefined")
    {
      return (

        <div className="editor-page">
          <div className="container page">
            <div className="row">
              <div className="col-md-10 offset-md-1 col-xs-12">

                <ListErrors errors={this.props.errors}></ListErrors>

                <form>
                  <fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Title"
                        value={this.props.title}
                        onChange={this.updateFieldEvent('title')} />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Sub Title"
                        value={this.props.subtitle}
                        onChange={this.updateFieldEvent('subtitle')} />
                    </fieldset>

                    <fieldset className="form-group">
                      <textarea
                        className="form-control form-control-lg"
                        rows="8"
                        placeholder="Text"
                        value={this.props.text}
                        onChange={this.updateFieldEvent('text')}>
                      </textarea>
                    </fieldset>


                    <fieldset className="form-group">  
                      <DropzoneComponent config={componentConfig}
                                        eventHandlers={eventHandlers}
                                        djsConfig={djsConfig}/>
                    </fieldset>

                    <button
                      className="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      disabled={this.props.inProgress}
                      onClick={this.submitForm}>
                      Publish Product
                    </button>
  

                  </fieldset>
                </form>

                {(this.props.uploadProgress) ? (<div><p>Sending data to server:</p><Line percent={this.props.uploadProgress} strokeWidth="1" trailWidth="1" trailColor="#D3D3D3" strokeColor="#0074d9" /></div>) : (<div></div>)}

                  <hr/>

                   <fieldset className="form-group">
                    <div className="row article-content">
                      <div className="col-xs-12">

                        {(this.props.images.length) ? (<p>Images:</p>) : (<div></div>)}
                        { Object.keys(this.props.images).filter( key => !this.state.deleted_images.includes(this.props.images[key].image) ).map(key => 
                         
                          { 
                            return ( <span key={`image_` + key} className="img-wrap">
                            <span className="delete" onClick={this.deleteMedia(this.props.images[key].image, 'images_url')} ><i className="ion-trash-a"></i></span>
                            <ReadMedia  type='image' resize={{ 'width':'11rem', 'height':'7rem' }} url={this.props.images[key].image} />
                            </span> ) 
                          }

                        )}

                        {(this.props.videos.length) ? (<p>Videos:</p>) : (<div></div>)}
                        { Object.keys(this.props.videos).filter(key => !this.state.deleted_videos.includes(this.props.videos[key].video)).map(key => 
                         
                          { 
                            return ( <span key={`video_` + key} className="img-wrap">
                            <span className="delete" onClick={this.deleteMedia(this.props.videos[key].video, 'videos_url')} ><i className="ion-trash-a"></i></span>
                            <ReadMedia  type='video' resize={{ 'width':'11rem' }} url={this.props.videos[key].video} />
                            </span> ) 
                          }

                        )}

                        {(this.props.audios.length) ? (<p>Audios:</p>) : (<div></div>)}
                        { Object.keys(this.props.audios).filter(key => !this.state.deleted_audios.includes(this.props.audios[key].audio)).map(key => 

                          { 
                            return ( <span key={`audio_` + key} className="img-wrap">
                            <span className="delete" onClick={this.deleteMedia(this.props.audios[key].audio, 'audios_url')} ><i className="ion-trash-a"></i></span>
                            <ReadMedia  type='audio' resize={{ 'width':'11rem' }} url={this.props.audios[key].audio}/>
                            </span> ) 
                          }

                        )}
                      </div>
                    </div>
                  </fieldset>
                  
                </div>
              </div>
            </div>
          </div>
        )
    } else { return null; }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
