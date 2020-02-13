import React from 'react';
import { connect } from 'react-redux';
import ImageMediaReader from './Readers/ImageMediaReader';

const mapStateToProps = state => ({
   token: state.common.token,
});

class ReadMedia extends React.Component {

  constructor() {
      super();
      this.state = {
        media_image: [],
        media_video: [],
        media_audio: [],
        loaded: false
      };
  }



  refreshMedia(props) {

      const that = this;
      
        if (props.type.startsWith('image'))
        {
          that.setState({ loaded: true, media_image: that.state.media_image.concat(props.url) });
        } 
        else if (props.type.startsWith('video'))
        {
          that.setState({ loaded: true, media_video: that.state.media_video.concat(props.url) });
        }
        else if (props.type.startsWith('audio'))
        {
          that.setState({ loaded: true, media_audio: that.state.media_audio.concat(props.url) });
        }

  }

  componentDidMount(){
    this.refreshMedia(this.props);
  }


  render() {

        const add_token = '?token=' + this.props.token;

        if (this.state.loaded) {

            let media;
            if (this.props.type === 'image'){
                this.state.media_image.map(key => media = <ImageMediaReader style={(this.props.resize) ? this.props.resize : {'width':'100%'} } url={key} />);
            } 
            else if (this.props.type === 'video'){
                this.state.media_video.map(key =>  media = <video style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={key} controls><source src={key + add_token} /></video>);
            } 
            else if (this.props.type === 'audio'){
                this.state.media_audio.map(key =>  media = <audio style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={key} controls><source src={key + add_token} /></audio>);
            }
            return media;

        } else {
            return <img width="150" height="100" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt='Loading...'/>
        }


  }
}

export default connect(mapStateToProps)(ReadMedia);

export { ReadMedia };