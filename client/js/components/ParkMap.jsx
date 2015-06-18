import _ from 'lodash';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';

import utils from '../utils';
import ParkFeatureList from './ParkFeatureList.jsx';


function onEachFacility(feature, layer) {
    layer.bindPopup(feature.properties.FACILITY_NAME);
}

function onEachAmenity(feature, layer) {
    layer.bindPopup(`
        ${feature.properties.AMENITY_NAME} <br />
        <i>${feature.properties.DESCRIPTION}</i>
    `);
}

function onEachPark(feature, layer) {
    layer.setStyle({
        color: 'rgb(56,158,70)',
        opacity: 1,
        weight: 1,
        fillColor: 'rgb(86,221,84)',
        fillOpacity: 0.5,
    });
}

function onEachTrail(feature, layer) {
    layer.setStyle({
        color: 'rgb(165,105,9)',
        opacity: 1,
        weight: 4,
        fillColor: 'rgb(218,193,145)',
        fillOpacity: 0.5,
    });
}


export default class ParkMap extends React.Component {

    fitBounds() {
        if (this.props.parkGeo) {
            var bounds = utils.boundsForFeature(this.props.parkGeo);
            this.refs.map.getLeafletElement().fitBounds(bounds);
        }
    }

    componentDidMount() {
        this.fitBounds();
    }

    componentDidUpdate(prevProps, prevState) {
        this.fitBounds();
    }

    showFeatureInMap(featureID) {
        var matchingLayer = _.find(this.refs.map.leafletElement._layers, (layer) => layer.feature && layer.feature.id === featureID);
        if (!matchingLayer) {
            console.error('No layer for', featureID);
            return;
        }
        var mapNode = React.findDOMNode(this.refs.map);
        window.scrollTo(0, mapNode.parentNode.offsetTop + mapNode.offsetTop);

        matchingLayer.openPopup();
    }

    render () {
        var parkSummary = !this.props.parkGeo ? null : (
            <div className='row'>
                <div className='six columns'>
                    <div>{this.props.parkGeo.properties.PARK_NAME} </div>
                    <div>{this.props.parkGeo.properties.ADDRESS} </div>
                    <div>{this.props.parkGeo.properties.COUNCIL_DISTRICT_AREAS} </div>
                    <div>Park status: {this.props.parkGeo.properties.PARK_STATUS} </div>
                    <div>Acres: {this.props.parkGeo.properties.PARK_ACRES} </div>
                </div>
                <div className='six columns'>
                    <div>Unit ID: {this.props.parkGeo.properties.UNIT_ID} </div>
                    <div>Land owner: {this.props.parkGeo.properties.LAND_OWNER} </div>
                    <div>Management priority: {this.props.parkGeo.properties.MANAGEMENT_PRIORITY} </div>
                    <div>Acquisition source: {this.props.parkGeo.properties.ACQUISITION_SOURCE} </div>
                    <div>Park type: {this.props.parkGeo.properties.PARK_TYPE} </div>
                    <div>Development status: {this.props.parkGeo.properties.DEVELOPMENT_STATUS} </div>
                </div>
            </div>
        );

        return (
            <div>
                <div className='row'>
                    <h3>{this.props.name}</h3>
                </div>
                <div className='row'>
                    <Map id='map' ref='map' center={this.props.center} minZoom={10}>
                        <TileLayer
                            url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                            attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                            id='drmaples.ipbindf8' />
                        {this.props.parkGeo ? <GeoJson data={this.props.parkGeo} onEachFeature={onEachPark} /> : null}
                        {this.props.amenityGeo ? <GeoJson data={this.props.amenityGeo} onEachFeature={onEachAmenity} /> : null}
                        {this.props.facilityGeo ? <GeoJson data={this.props.facilityGeo} onEachFeature={onEachFacility} /> : null}
                        {this.props.trailGeo ? <GeoJson data={this.props.trailGeo} onEachFeature={onEachTrail} /> : null}
                    </Map>
                </div>
                {parkSummary}
                <ParkFeatureList
                    amenityGeo={this.props.amenityGeo}
                    facilityGeo={this.props.facilityGeo}
                    showFeatureInMap={this.showFeatureInMap.bind(this)} />
            </div>
        );
    }
}

ParkMap.propTypes = {
    name: React.PropTypes.string.isRequired,
    center: React.PropTypes.array.isRequired,
    parkGeo: React.PropTypes.object,
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    trailGeo: React.PropTypes.object,
};
