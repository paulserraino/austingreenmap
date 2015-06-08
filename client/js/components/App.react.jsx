import $ from 'jquery';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';


function getParks() {
    return $.getJSON("/data/city_of_austin_parks.geojson");
}

function getFeature(parkID, featureType) {
    return $.getJSON(`/data/${featureType}/park_${parkID}.geojson`);
}

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return <div>hi</div>;
    }
    // getFeature(pID, "park")
        // .then((data) => this.setState({park: data}) );
    // getFeature(pID, "amenity")
        // .then((data) => this.setState({amenity: data}) );
    // getFeature(pID, "facility")
        // .then((data) => this.setState({facility: data}) );
    // getFeature(pID, "trail")
        // .then((data) => this.setState({trail: data}) );
}
