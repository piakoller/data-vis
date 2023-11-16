import React, { useState, useEffect, useMemo } from "react";
import geo from './components/geo.json';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import * as d3 from 'd3';
import Papa from 'papaparse';
import { useSelectedCountry } from './SelectedCountry';

import Slider from '@mui/material/Slider';
import { debounce } from 'lodash';
import './App.css';

const Tooltip = ({ x, y, location, value }) => (
    <foreignObject x={x} y={y} width={200} height={100}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '3px', outline: '1px solid black' }}>
            <h4>{location}</h4>
            <p>{value}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '8px', padding: '3px', outline: '1px solid black' }}>
            <h4>{location}</h4>
            <p>{value}</p>
        </div>
    </foreignObject>
);

const Map = () => {
    const [data, setData] = useState({});
    const [selectedYear, setSelectedYear] = useState(1960); // Default year
    const { selectedCountry, setSelectedCountry } = useSelectedCountry();

    const [tooltip, setTooltip] = useState(null);
    const [formattedData, setFormattedData] = useState({});



    const debouncedHandleChange = debounce(async (event, newValue) => {
        if (typeof newValue === 'number') {
            setSelectedYear(newValue);
        }
    }, 300);



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

    const getColor = useMemo(() => {
        const color = d3.scaleSequential(d3.interpolateOranges);
        return (value) => color(value / 25);
    }, []);

    const width = 1000;
    const height = width * 0.5;
    const projection = geoMercator().fitExtent(
        [[0, 0], [width * 0.9, height * 0.9]],
        geo
    );
    const path = geoPath().projection(projection);


    const handleCountryClick = (location, value) => {
        if (selectedCountry !== location) {
          setSelectedCountry(location);
          setTooltip({ location, value });
        } else {
          setSelectedCountry(null);
          setTooltip(null);
        }
      };

    return (
        <div>
            <div style={{ padding: 20, width: "50%", margin: "auto" }}>
                <Slider
                    value={selectedYear}
                    onChange={(event, newValue) => debouncedHandleChange(event, newValue)}
                    aria-label="Year"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1960}
                    max={2019}
                />
                <h2>Year: {selectedYear}</h2>
            </div>

            <svg width={width} height={height}>
                <g className="geo-layer">
                    {geo.features.map(d => {
                        const location = d.properties.sovereignt;
                        const value = data[selectedYear]?.[location] || 0;
                        const isSelected = selectedCountry !== location;

                        return (
                            <g key={d.properties.Name}>
                                <path
                                    d={path(d)}
                                    fill={getColor(value)}
                                    stroke="#0e1724"
                                    strokeWidth="1"
                                    strokeOpacity="0.5"
                                    onClick={(e) => {
                                        handleCountryClick(location, value);
                                        select(e.target).attr('fill', isSelected ? 'blue' : getColor(value));
                                      }}
                                    // onMouseEnter={(e) => {
                                    //     select(e.target).attr('fill', 'grey');
                                    // }}
                                    // onMouseOut={(e) => {
                                    //     select(e.target).attr('fill', getColor(value));
                                    // }}
                                    selectedCountry={selectedCountry}
                                />
                                {tooltip && (
                                    <Tooltip x={tooltip.x} y={tooltip.y} location={tooltip.location} value={tooltip.value} />
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default Map;
