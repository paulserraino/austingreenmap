import $ from 'jquery';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import ParkMap from './ParkMap.jsx';
import ParkList from './ParkList.jsx';


function getParksJson() {
    return $.getJSON("/data/parks.json");
}

function getFeatureGeoJson(parkID, featureType) {
    return $.getJSON(`/data/${featureType}/park_${parkID}.geojson`);
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {park: null,
                      parkList: [],
                      parkByID: {}};
        getParksJson().then((data) => {
            var parkByID = {}
            data.forEach((current, index) => {
                // NOTE: Coordinates are lng lat here
                current.center.reverse();
                parkByID[current.park_id] = current;
            });
            this.setState({parkList: data, parkByID: parkByID});
        });
    }

    selectPark(parkID) {
        return $.when(
            getFeatureGeoJson(parkID, "park"),
            getFeatureGeoJson(parkID, "amenity"),
            getFeatureGeoJson(parkID, "facility"),
            getFeatureGeoJson(parkID, "trail")).done(
            (park, amenity, facility, trail) => {
                this.setState({
                    parkID: parkID,
                    park: park,
                    trail: trail,
                    facility: facility,
                    amenity: amenity,
                    center: this.state.parkByID[parkID].center
                });
            }
        );
    }

    render() {
        var content;
        if (this.state.park) {
            content = (
                <ParkMap parkID={this.state.parkID} park={this.state.park}
                    facility={this.state.facility} amenity={this.state.amenity}
                    trail={this.state.trail} center={this.state.center} />
            );
        } else {
            content = (
                <ParkList parks={this.state.parkList}
                    onSelectPark={this.selectPark.bind(this)} />
            );
        }
        return <div>{content}</div>;
    }
}

// [{"address": "7515 Step Down Cv., Austin, Texas 78731", "name": "Barrow Nature Preserve", "center": [-97.7688127885669, 30.3715875145322], "park_id": 112, "acres": 7.03700011},
