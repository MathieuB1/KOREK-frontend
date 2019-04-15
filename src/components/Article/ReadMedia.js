import React from 'react';
import { connect } from 'react-redux';


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

  componentDidMount(){

    const media_type = this.props.type;
    const that = this;
    
    fetch(this.props.url, {
      method: 'GET', 
      headers: new Headers({
        'Authorization': 'Bearer  '+  window.localStorage.getItem('jwt'), 
      }), 
    })
    .then(function(response) {
      if(response.ok) {
        return response.blob();
      }
      throw new Error('Network response was not ok.');
    })
    .then(function(myBlob) { 
      var objectURL = URL.createObjectURL(myBlob); 

      if (media_type.startsWith('image'))
      {
        that.setState({ loaded: true, media_image: that.state.media_image.concat(objectURL) });
      } 
      else if (media_type.startsWith('video'))
      {
        that.setState({ loaded: true, media_video: that.state.media_video.concat(objectURL) });
      }
      else if (media_type.startsWith('audio'))
      {
        that.setState({ loaded: true, media_audio: that.state.media_audio.concat(objectURL) });
      }
    })
    .catch(function(error) {
      console.log('Problem with the fetch operation: ', error.message);
    });

  }

  render() {

        let media;
        if (this.state.loaded) {
            if (this.props.type === 'image'){
                this.state.media_image.map(key => media = <img style={{'width':'100%'}} key={key} src={key} alt={key} />);
                return media;
            } 
            else if (this.props.type === 'video'){
                this.state.media_video.map(key =>  media = <video style={{'width':'100%'}} key={key} controls><source src={key} /></video>);
                return media;
            } 
            else if (this.props.type === 'audio'){
                this.state.media_audio.map(key =>  media = <audio key={key} controls><source src={key} /></audio>);
                return media;
            }
        }

    return ( 

          (this.state.loaded) ? (
                {media}
          ) : (<img width="150" height="100" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt='Loading...'/>)

      )


  }
}

export default connect()(ReadMedia);
export { ReadMedia };