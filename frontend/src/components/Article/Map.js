import React from "react";
import L from "leaflet";
import { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';

const style = {
  width: "100%",
  height: "300px"
};

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      max: this.props.markerPositions.length-1,
    };
  }

  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [49.8419, 24.0315],
      zoom: 16,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });
    // List of Markers
    this.markers = [];

  }

  centerLeafletMapOnMarker(map, markers) {
    var group = new L.featureGroup(markers);
    this.map.fitBounds(group.getBounds());
  }

  componentDidUpdate(prevProps, prevState) {
    // check if positions have changed
    if (this.props.markerPositions && this.props.markerPositions !== prevProps.markerPositions) {

        // clear all markers if any
        if (this.markers != null ){
          for(var i=0; i < this.markers.length; i++){
            this.map.removeLayer(this.markers[i]);
          }
        }

        var greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41] 
        });

        // add marker
        this.markers.push(new L.marker(this.props.markerPositions[this.props.markerPositions.length-1][0],  {icon: greenIcon}).addTo(this.map))
        var latlngs = this.props.markerPositions.map((key,idx) => [key[0].lat, key[0].lon])
        this.polyline = new L.polyline(latlngs, {color: 'blue'}).addTo(this.map)
        // go to marker
        if(this.markers.length){
          this.centerLeafletMapOnMarker(this.map, this.markers)
        }
    }

    if (this.state.min !== prevState.min || this.state.max !== prevState.max) {
        var latlngs_ = this.props.markerPositions.filter((key,idx) => (idx > this.state.min) && (idx < this.state.max) ).map((key,idx) => [key[0].lat, key[0].lon])
        if (this.polyline !== undefined) {this.map.removeLayer(this.polyline);}
        this.polyline = new L.polyline(latlngs_, {color: 'blue'}).addTo(this.map)
    }

  }

  onSliderChange = (value) => {
    this.setState({ min: value[0], max: value[1] });
  }

  render() {
    const default_max = this.props.markerPositions.length-1;
    const default_min = 0;
    return <div><div id="map" style={style} />
                <Range defaultValue={[default_min, default_max]} allowCross={false} min={default_min} max={default_max} onChange={this.onSliderChange}/>
           </div>;
  }
}

export default Map;