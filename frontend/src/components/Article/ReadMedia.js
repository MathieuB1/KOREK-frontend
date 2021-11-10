import React from 'react';
import { connect } from 'react-redux';
import ImageMediaReader from './Readers/ImageMediaReader';
import { PDFReader } from 'reactjs-pdf-reader';

const mapStateToProps = state => ({
   token: state.common.token,
});

class ReadMedia extends React.Component {

  constructor() {
      super();
      this.state = {
        media_image: '',
        media_video: '',
        media_audio: '',
        media_file: '',
        loaded: false
      };
  }

  refreshMedia(props) {

      const that = this;
      
        if (props.type.startsWith('image'))
        {
          that.setState({ loaded: true, media_image: props.url });
        } 
        else if (props.type.startsWith('video'))
        {
          that.setState({ loaded: true, media_video: props.url });
        }
        else if (props.type.startsWith('audio'))
        {
          that.setState({ loaded: true, media_audio: props.url });
        }
        else if (props.type.startsWith('file'))
        {
          that.setState({ loaded: true, media_file: props.url });
        }
        else if (props.type.startsWith('pdf'))
        {
          that.setState({ loaded: true, media_file: props.url });
        }
  }

  componentDidMount(){
    this.refreshMedia(this.props);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props && this.props.url && this.props !== prevProps)
    {
      this.refreshMedia(this.props);
    }
  }

  render() {

        const add_token = '?token=' + this.props.token;

        if (this.state.loaded) {

            let media;
            if (this.props.type === 'image'){
                media = <ImageMediaReader style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={this.state.media_image} url={this.state.media_image} />;
            } 
            else if (this.props.type === 'video'){
                media = <video style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={this.state.media_video} controls><source src={this.state.media_video + add_token} /></video>;
            } 
            else if (this.props.type === 'audio'){
                media = <audio style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={this.state.media_audio} controls><source src={this.state.media_audio + add_token} /></audio>;
            }
            else if (this.props.type === 'pdf') {
                media = <PDFReader key={this.state.media_file} style={(this.props.resize) ? this.props.resize : {'width':'100%'}} url={this.state.media_file + add_token}/>;
            }
            else if (this.props.type === 'file'){
                media = <a key={this.state.media_file} href={this.state.media_file + add_token} style={(this.props.resize) ? this.props.resize : {'width':'100%'} }>
                <i style={{'fontSize':'2rem', 'margin':'0.5rem'}} className="ion-android-archive"/>
                <div style={{'color':'black'}}>{this.state.media_file.split('/').pop()}</div></a>;
            }
            return media;

        } else {
            return <img width="150" height="100" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt='Loading...'/>
        }


  }
}

export default connect(mapStateToProps)(ReadMedia);

export { ReadMedia };