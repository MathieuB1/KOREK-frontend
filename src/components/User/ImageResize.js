import React from 'react';

class ImageResize extends React.Component {

  constructor() {
    super();
    this.state = {
        imagePreviewUrl: ''
    };
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
      
    }

    reader.readAsDataURL(file);
    this.props.updateImage(file);
  }



  render() {

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} alt="me" width="100" height="100" style={{'border-radius':'50px', 'display': 'block', marginLeft: 'auto', marginRight: 'auto' }}/>);
    } else {
      $imagePreview = (<div></div>);
    }

    return (

        <div>
            <div className="imgPreview" >
                {$imagePreview}
            </div>

            <input className="form-control form-control-lg btn btn-outline-default action-btn"
            type="file"
            accept="image/*"
            onChange={(e)=>this._handleImageChange(e)} />
        </div>

    )
  }
}

export default ImageResize;
