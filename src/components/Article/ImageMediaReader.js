import React  from "react";
import agent from '../../agent';
import { connect } from 'react-redux';

import {
  FETCH_MEDIA
} from '../../constants/actionTypes';


const mapStateToProps = state => ({
  media: state.common.media,
  media_name: state.common.media_name
});

const mapDispatchToProps = dispatch => ({
  onLoadMedia: (payload) => dispatch({ type: FETCH_MEDIA, payload })
});


class ImageMediaReader extends React.Component {
  constructor() {
    super();
    this.state = {
      display: null
    }
  }


  componentDidMount() {
    this.props.onLoadMedia(agent.Articles.get_media(this.props.url));
  }


  componentDidUpdate(prevProps, prevState) {
    
   if (this.props.media_name === this.props.url && this.props.media !== prevProps.media) {

      var reader = new FileReader();
      var that = this;

      reader.onload = function() {
        that.setState({ display: this.result });
      };
      
      reader.readAsDataURL(this.props.media);
    }
  
  }

  render() {
    return <img style={this.props.display_first_image} className={this.props.className} src={ this.state.display } alt={this.props.url} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageMediaReader);