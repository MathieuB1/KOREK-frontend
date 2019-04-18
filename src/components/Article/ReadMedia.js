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


  refreshMedia(props) {

      const media_type = props.type;
      const that = this;
      
      fetch(props.url, {
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

  componentDidMount(){
    this.refreshMedia(this.props);
  }


  render() {


        if (this.state.loaded) {

            let media;
            if (this.props.type === 'image'){
                this.state.media_image.map(key => media = <img style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={key} src={key} alt={key} />);
            } 
            else if (this.props.type === 'video'){
                this.state.media_video.map(key =>  media = <video style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={key} controls><source src={key} /></video>);
            } 
            else if (this.props.type === 'audio'){
                this.state.media_audio.map(key =>  media = <audio style={(this.props.resize) ? this.props.resize : {'width':'100%'} } key={key} controls><source src={key} /></audio>);
            }
            return media;

        } else {
            return <img width="150" height="100" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt='Loading...'/>
        }


  }
}

export default connect()(ReadMedia);
export { ReadMedia };