import React from 'react';
import geo from './data/geo.json';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import * as d3 from 'd3';

var data = {
    "United States of America": 30,
    "Canada": 20,
    "Mexico": 15,
};

export default class Map extends React.Component {

    getColor(value) {
        // Implement your color scale logic here
        // For example, you can use a linear scale to map values to colors
        // Adjust the domain and range based on your data and desired colors
        const colorScale = d3.scaleLinear()
            .domain([0, 30])
            .range(["#fff", "green"]);

        return colorScale(value);
    }

    render() {
        const width = 500;
        const height = width * 0.5;
        const projection = geoMercator().fitExtent(
            [[0, 0], [width * 0.9, height * 0.9]],
            geo
        );
        const path = geoPath().projection(projection);

        return (
            <svg width={width} height={height}>
                <g className="geo-layer">
                    {
                        geo.features.map(d => 
                            (
                            <path
                                key={d.properties.Name}
                                d={path(d)}
                                fill={this.getColor(data[d.properties.sovereignt] || 0)}
                                stroke="#0e1724"
                                strokeWidth="1"
                                strokeOpacity="0.5"
                                onMouseEnter={(e) => {
                                    console.log(d.properties);
                                    select(e.target)
                                        .attr('fill', 'blue');
                                }}
                                onMouseOut={(e) => {
                                    select(e.target)
                                        .attr('fill', this.getColor(data[d.properties.sovereignt] || 0));
                                }}
                            />
                        ))
                    }
                </g>
            </svg>
        );
    }
}
