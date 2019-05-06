import React from 'react';
import Card from 'react-bootstrap/Card';


const HomeCards = () => {

  return (
    <div className="col-md-12" style={{'display':'inline-flex'}}>

        <Card>
        <i className="ion-android-upload"></i> 
        <Card.Body>
            <Card.Title>Upload</Card.Title>
            <Card.Text>
            Upload your own media (images, videos, audios) 
            </Card.Text>
        </Card.Body>
        </Card>

        <Card>
        <i className="ion-android-lock"></i> 
        <Card.Body>
            <Card.Title>Privacy</Card.Title>
            <Card.Text>
            Articles are protected.
            Set privacy to your articles.
            </Card.Text>
        </Card.Body>
        </Card>

        <Card>
        <i className="ion-share"></i> 
        <Card.Body>
            <Card.Title>Share</Card.Title>
            <Card.Text>
            Share articles with my contacts
            </Card.Text>
        </Card.Body>
        </Card>


    </div>
  );
};

export default HomeCards;
