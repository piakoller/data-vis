import React, { useState, useEffect } from "react";
import geo from './components/geo.json';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import * as d3 from 'd3';
import Papa from 'papaparse';

const Map = () => {
    const [data, setData] = useState({});
    const [selectedYear, setSelectedYear] = useState(1960); // Default year

    useEffect(() => {
        fetch('./data/merged_data.csv')
          .then(response => response.text())
          .then(csvData => {
            const parsedData = Papa.parse(csvData, { header: true });
            const formattedData = {};

            parsedData.data.forEach(entry => {
              const year = parseInt(entry.TIME);
              if (!formattedData[year]) {
                formattedData[year] = {};
              }
              formattedData[year][entry.LOCATION] = parseFloat(entry.VALUE);
            });

            setData(formattedData);
          })
          .catch(error => {
            console.error('Error fetching CSV:', error);
          });
      }, []);

    const getColor = (value) => {
        const colorScale = d3.scaleLinear()
            .domain([0, 25])
            .range(["#fff", "green"]);

        return colorScale(value);
    };

    const width = 1000;
    const height = width * 0.5;
    const projection = geoMercator().fitExtent(
        [[0, 0], [width * 0.9, height * 0.9]],
        geo
    );
    const path = geoPath().projection(projection);

    return (
        <div>
            <input
                type="range"
                min={1960}
                max={2022} // Update max year as needed
                step={1}
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
            {selectedYear}
            <svg width={width} height={height}>
                <g className="geo-layer">
                    {
                        geo.features.map(d => {
                            const location = d.properties.sovereignt;
                            const value = data[selectedYear]?.[location] || 0;

                            return (
                                <path
                                    key={d.properties.Name}
                                    d={path(d)}
                                    fill={getColor(value)}
                                    stroke="#0e1724"
                                    strokeWidth="1"
                                    strokeOpacity="0.5"
                                    onMouseEnter={(e) => {
                                        select(e.target).attr('fill', 'blue');
                                    }}
                                    onMouseOut={(e) => {
                                        select(e.target).attr('fill', getColor(value));
                                    }}
                                />
                            );
                        })
                    }
                </g>
            </svg>
        </div>
    );
};

export default Map;
