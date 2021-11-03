import React  from "react";
import agent from '../../../agent';
import { connect } from 'react-redux';

import {
  FETCH_IMAGE_MEDIA
} from '../../../constants/actionTypes';


const mapStateToProps = state => ({
  media: state.common.media,
  media_name: state.common.media_name
});

const mapDispatchToProps = dispatch => ({
  onLoadImageMedia: (payload) => dispatch({ type: FETCH_IMAGE_MEDIA, payload })
});


class ImageMediaReader extends React.Component {
  constructor() {
    super();
    this.state = {
      display: null
    }
  }


  componentDidMount() {
    this.props.onLoadImageMedia(agent.Articles.get_image_media(this.props.url));
  }


  componentDidUpdate(prevProps, prevState) {
   if (this.props.media_name === this.props.url && this.state.display === null) {

      var reader = new FileReader();
      var that = this;

      reader.onload = function() {
        that.setState({ display: this.result });
      };
      
      reader.readAsDataURL(this.props.media);
    }
  
  }


  render() {
    if (this.state.display) {
        return <img style={this.props.style} className={this.props.className} src={ this.state.display } alt={this.props.url} />;
    } else {
        return <img width="150" height="100" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt='Loading...'/>
    }
  }


}

export default connect(mapStateToProps, mapDispatchToProps)(ImageMediaReader);