import React from "react";
import L from "leaflet";

const style = {
  width: "100%",
  height: "300px"
};

class Map extends React.Component {

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

  }

  centerLeafletMapOnMarker(map, markers) {
    var group = new L.featureGroup(markers);
    this.map.fitBounds(group.getBounds());
  }

  componentDidUpdate(prevProps, prevState) {
    // check if positions have changed
    if (this.props.markerPositions !== prevProps.markerPositions) {

        var greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41] 
        });

        // add marker
        var markers = [];
        this.props.markerPositions.map((key,idx) => 
           //markers.push(new L.marker(key[0],  {icon: greenIcon}).addTo(this.map))
           (idx === 1) ? markers.push(new L.marker(key[0],  {icon: greenIcon}).addTo(this.map)) : markers.push(new L.marker(key[0]).addTo(this.map))
        )


        // go to marker
        if(markers.length){
          this.centerLeafletMapOnMarker(this.map, markers)
        }
    }
  }

  render() {
    return <div id="map" style={style} />;
  }
}

export default Map;