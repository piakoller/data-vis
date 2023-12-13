import React, { useState, useEffect, useMemo } from "react";
import geo from '../components/map.json';
import { geoMercator, geoPath } from 'd3-geo';
import * as d3 from 'd3';
import { useSelectedData } from './Selected';
import { fetchWorldMapData } from './DataFetcher';

import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import { debounce, max } from 'lodash';
import '../App.css';
import './WorldMap.css'

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
    const { selectedCountry, setSelectedCountry, selectedYear, hoverCountry, setHoverCountry, selectCountry, unselectCountry, unselectAll } = useSelectedData();

    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        fetchWorldMapData()
            .then(data => {
                setData(data);
            });
    }, []);

    const getColor = useMemo(() => {
        const colorScale = d3.scaleSequential(d3.interpolateOranges);
        return (value) =>
            colorScale(value / 15);
    }, []);


    const width = 800;
    const height = width * 0.5;
    const projection = geoMercator().fitExtent(
        [[0, 0], [width * 0.9, height * 0.9]],
        geo
    );
    const path = geoPath().projection(projection);


    const getColorForSelected = (location) => {
        const selected = selectedCountry.find((selected) => selected.country === location);
        return selected?.color || '#d0d0d0';
    }

    const handleCountryClick = (location, value) => {
        if (selectedCountry.some((selected) => selected.country === location)) {
            unselectCountry(location);
        } 
        else {
            selectCountry(location);
            setTooltip({ location, value });
        }

    };
    const isCountrySelected = (location) => selectedCountry.some((selected) => selected.country === location);

    const legendWidth = 200;
    const legendHeight = 20;

    const legendScale = d3.scaleSequential(d3.interpolateOranges)
        .domain([0, 25]); // Adjust the domain based on your data

    const legendValues = [0, 5, 10, 15, 20, 25]; // Adjust these values based on your data range

    const handleMouseEnter = (location) => {
        setHoverCountry(location);
    };

    const handleMouseLeave = () => {
        setHoverCountry(null);
    };

    return (
        <div width="100%" height="100%" viewBox="0 0 1000 500">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
               {/*  <Chip
                    key="Select All"
                    label="Select All"
                    onClick={() => {
                        setSelectedCountry(['Albania', 'Andorra', 'Austria',
                            'Belgium', 'Bulgaria', 'Bosnia and Herzegovina', 'Belarus',
                            'Switzerland', 'Czechia', 'Germany', 'Denmark', 'Spain',
                            'Estonia', 'Finland', 'France', 'United Kingdom',
                            'Greece', 'Croatia', 'Hungary', 'Ireland', 'Iceland',
                            'Italy', 'Lithuania', 'Luxembourg',
                            'Latvia', 'Moldova', 'North Macedonia', 'Montenegro',
                            'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania',
                            'Republic of Serbia', 'Slovakia', 'Slovenia', 'Sweden',
                            'Ukraine']);
                    }}
                /> */}
                <Chip
                    disabled={selectedCountry.length === 0}
                    key="Deselect All"
                    label="Deselect All"
                    onClick={() => {
                        unselectAll();
                    }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: "column", width: 150, position: "absolute",  gap: 8, padding: 16, overflowY: "auto", height: 400 }}>
                {/* Render selected countries as filter chips */} 
                {selectedCountry &&
                    selectedCountry.map((country) => (
                        <Chip
                            sx={{width: "100%", justifyContent: "space-between", backgroundColor: country.color, padding: 2}}
                            key={country.country}
                            label={country.country}
                            onDelete={() => {
                                unselectCountry(country.country);
                            }}
                        />
                    ))}
            </div>
            <svg width={width} height={height}>
                <g className="geo-layer">
                    {geo.features.map(d => {
                        const location = d.properties.sovereignt;
                        const value = data[selectedYear]?.[location] || 0;
                        const color = getColor(value.value, location);
                        const isSelected = isCountrySelected(location);
                        const fillOpacity = selectedCountry.length === 0 ? 1 : isSelected ? 1 : 0.3  // Change opacity for unselected countries
                        const outline = isSelected ? getColorForSelected(location) || '#d0d0d0' : '#d0d0d0'; // Access color for the selected country and year
                        const outlineStroke = isSelected ? '3' : '1';
                        const scale = isSelected ? 1 : 1; // Adjust scale for selected countries

                        // Calculate the center of the country's path
                        const bounds = path.bounds(d);
                        const centerX = (bounds[0][0] + bounds[1][0]) / 2;
                        const centerY = (bounds[0][1] + bounds[1][1]) / 2;

                        return (
                            <g key={d.properties.name}>
                                <path
                                    d={path(d)}
                                    fill={color}
                                    fillOpacity={fillOpacity}
                                    stroke={outline}
                                    strokeWidth={outlineStroke}
                                    transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`} // Apply scale transformation around the center of the country
                                    onMouseEnter={() => handleMouseEnter(location)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={(e) => {
                                        handleCountryClick(location, value);
                                    }}
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>
            {/* Legend */}
            <svg width={legendWidth} height={legendHeight}>
                {legendValues.map((value, index) => (
                    <rect
                        key={index}
                        x={index * (legendWidth / legendValues.length)}
                        y={0}
                        width={legendWidth / legendValues.length}
                        height={legendHeight}
                        fill={legendScale(value)}
                    />
                ))}
                <text x={0} y={legendHeight + 15}>{legendValues[0]}</text>
                {legendValues.slice(1).map((value, index) => (
                    <text
                        key={index + 1}
                        x={(index + 1) * (legendWidth / legendValues.length)}
                        y={legendHeight + 15}
                        textAnchor="middle"
                    >
                        {value}
                    </text>
                ))}
                <text x={legendWidth} y={legendHeight + 15} textAnchor="end">{legendValues[legendValues.length - 1]}</text>
                {/* Legend labels */}
                {legendValues.map((value, index) => (
                    <text
                        key={index}
                        x={index * (legendWidth / legendValues.length) + (legendWidth / legendValues.length) / 2}
                        y={legendHeight + 35}
                        textAnchor="middle"
                    >
                        {value}
                    </text>
                ))}
            </svg>
        </div >
    );
};

export default Map;
