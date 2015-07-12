import _ from 'lodash';
import React from 'react';

import api from '../utils/api';


export default class AllParksList extends React.Component {
    selectPark(park) {
        this.props.onSelectPark(park);
    }

    render() {
        var sortedParks = _.sortByAll(this.props.parks, 'distance', 'name');

        var parkList = sortedParks.map((park) => {
            return (
                <div className='park-list-item row u-clickable' onClick={() => this.selectPark(park)} key={park.park_id}>
                    <div className='park-name nine columns'>{park.name}</div>
                    <div className='park-distance three columns'>{park.distance ? Math.round(park.distance * 100) / 100 + ' mi' : null}</div>
                </div>
            );
        });

        return (
            <div className='parks-list'>
                {parkList}
            </div>
        );
    }
}

AllParksList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};