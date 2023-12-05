import React, { useState, useEffect, useMemo } from "react";
import geo from '../components/map.json';
import { geoMercator, geoPath } from 'd3-geo';
import * as d3 from 'd3';
import { useSelectedCountry } from './SelectedCountry';
import { fetchWorldMapData } from './DataFetcher';

import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import { debounce } from 'lodash';
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
    const [selectedYear, setSelectedYear] = useState(1960); // Default year
    const { selectedCountry, setSelectedCountry } = useSelectedCountry();

    const [tooltip, setTooltip] = useState(null);

    const debouncedHandleChange = debounce(async (event, newValue) => {
        if (typeof newValue === 'number') {
            setSelectedYear(newValue);
        }
    }, 300);

    useEffect(() => {
        fetchWorldMapData()
            .then(data => {
                setData(data);
            });
    }, []);

    const getColor = useMemo(() => {
        const colorScale = d3.scaleSequential(d3.interpolateOranges);
        return (value) =>
            colorScale(value / 25);
    }, []);


    const width = 1000;
    const height = width * 0.5;
    const projection = geoMercator().fitExtent(
        [[0, 0], [width * 0.9, height * 0.9]],
        geo
    );
    const path = geoPath().projection(projection);


    const handleCountryClick = (location, value) => {
        if (!selectedCountry.includes(location)) {
            setSelectedCountry(location);
            setTooltip({ location, value });
            // Add the country to selectedCountries if it's not already in the list
            if (!selectedCountry.includes(location)) {
                setSelectedCountry([...selectedCountry, location]);
            }
        }
        else if (selectedCountry.includes(location)) {
            const updatedSelectedCountries = selectedCountry.filter(country => country !== location);
            setSelectedCountry(updatedSelectedCountries);
        }

    };
    const isCountrySelected = (location) => selectedCountry.includes(location);
    return (
        <div width="100%" height="100%" viewBox="0 0 1000 500">
            <div style={{ padding: 20, width: "50%", margin: "auto" }}>
                <Slider
                    value={selectedYear}
                    onChange={(event, newValue) => debouncedHandleChange(event, newValue)}
                    aria-label="Year"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1960}
                    max={2016}
                />
                <h2>Year: {selectedYear}</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
                <Chip
                    key="Select All"
                    label="Select All"
                    onClick={() => {
                        setSelectedCountry(['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan',
                        'Belgium', 'Bulgaria', 'Bosnia and Herzegovina', 'Belarus',
                        'Switzerland', 'Cyprus', 'Czechia', 'Germany', 'Denmark', 'Spain',
                        'Estonia', 'Finland', 'France', 'United Kingdom', 'Georgia',
                        'Greece', 'Croatia', 'Hungary', 'Ireland', 'Iceland', 'Israel',
                        'Italy', 'Kazakhstan', 'Kyrgyzstan', 'Lithuania', 'Luxembourg',
                        'Latvia', 'Moldova', 'North Macedonia', 'Malta', 'Montenegro',
                        'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia',
                        'Republic of Serbia', 'Slovakia', 'Slovenia', 'Sweden',
                        'Tajikistan', 'Turkmenistan', 'Turkey', 'Ukraine', 'Uzbekistan']);
                    }}
                />
                <Chip
                    key="Deselect All"
                    label="Deselect All"
                    onClick={() => {
                        setSelectedCountry([]);
                    }}
                />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
                {/* Render selected countries as filter chips */}
                {selectedCountry &&
                    selectedCountry.map((country) => (
                        <Chip
                            key={country}
                            label={country}
                            onDelete={() => {
                                setSelectedCountry(selectedCountry.filter((c) => c !== country));
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
                        const fillOpacity = selectedCountry.length == 0 ? 1 : isSelected ? 1 : 0.3  // Change opacity for unselected countries
                        const outline = isSelected ? data[selectedYear]?.[location]?.color || '#d0d0d0' : '#d0d0d0'; // Access color for the selected country and year
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
                                    onClick={(e) => {
                                        handleCountryClick(location, value);
                                    }}
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>

        </div>
    );
};

export default Map;
