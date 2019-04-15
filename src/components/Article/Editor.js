import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';
import './dropzone.css';

import {
  EDITOR_PAGE_LOADED,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
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
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      files: []
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

  updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);

  componentDidMount() {
    if (this.props.match.params.id) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.id));
    }
    this.props.onLoad(null);
  }

  componentWillReceiveProps(nextProps) {
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

                    { (!this.props.match.params.id) ? (
                      <fieldset className="form-group">  
                        <DropzoneComponent config={componentConfig}
                                          eventHandlers={eventHandlers}
                                          djsConfig={djsConfig}/>
                      </fieldset>
                    ) : (<div></div>) }

                    <button
                      className="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      disabled={this.props.inProgress}
                      onClick={this.submitForm}>
                      Publish Product
                    </button>

                  </fieldset>
                </form>

                </div>
              </div>
            </div>
          </div>
        )
    } else { return null; }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
