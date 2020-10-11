import React from "react";
import L from "leaflet";
import { LOCATION_SEARCHING } from '../../constants/actionTypes';
import { connect } from 'react-redux';
import agent from '../../agent';

const style = {
  width: "100%",
  height: "300px"
};

var url = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw";
const link = document.createElement("link");
link.async = true;
link.href = url + ".css";
link.rel = "stylesheet";
document.body.appendChild(link);

const script = document.createElement("script");
script.async = true;
script.src = url + ".js";
document.body.appendChild(script);

const mapStateToProps = state => ({
  ...state.common,
});

const mapDispatchToProps = dispatch => ({
    onLocationSearch: (tab, pager, payload, bbox) =>  dispatch({ type: LOCATION_SEARCHING, tab, pager, payload, bbox })
});

class Instersect extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      bbox: ""
    };
  }

  componentDidMount() {

    var that = this;
    // clear position
    this.props.onLocationSearch('filterLocation', agent.Articles.filter, agent.Articles.filter(""), "");
    // create map
    this.map = L.map("map", {
      drawControl: false,
      center: [46.8,2.2],
      zoom: 5,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup().addTo(this.map);

    var editing = false;

    this.map.on('click', function(e) {
      drawnItems.clearLayers();
      if(!editing){ // do not start multiple "edit sessions"
        editing = true;
        var polyEdit = new L.Draw.Rectangle(this);
        polyEdit.enable();
      }
    });

    this.map.on('draw:created', function (e) {

        var type = e.layerType,
            layer = e.layer;

        if (type === 'rectangle') {
            layer.on('mouseover', function() {
              var latlon = layer.getLatLngs()[0];

              var bbox = "" 
              for (let i=0; i< latlon.length; i++){ 
                  bbox += latlon[i]['lng'] + " " + latlon[i]['lat'] + ",";
              }
              bbox.substring(0, bbox.length - 1)
              that.setState({ bbox: bbox});

            });
        }

        drawnItems.addLayer(layer);
        editing = false;
    });

  }

  componentDidUpdate(prevProps, prevState) {
    // check if positions have changed
    if (this.state.bbox !== "" && this.state.bbox !== prevState.bbox) {
      var criteria = "";
      if (this.props.criteria) {
        criteria = this.props.criteria;
      }
      var bbox = criteria + "&bbox=" + this.state.bbox.slice(0, -1);
      this.props.onLocationSearch('filterLocation', agent.Articles.filter, agent.Articles.filter(bbox), bbox);
    }


  }

  render() {
    return <div><span><p>Draw a square</p></span><div id="map" style={style} /></div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Instersect);