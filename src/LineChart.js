import React, { useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';
import { useSelectedCountry } from './SelectedCountry';

import Tooltip from '@mui/material/Tooltip';

const LineChart = () => {
    const { selectedCountry } = useSelectedCountry();

    const [data, setData] = useState({});
    const [tooltipContent, setTooltipContent] = useState(null);

    const fetchDataForCountry = useCallback(country => {
        fetch('./data/merged_data.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData = Papa.parse(csvData, { header: true });
                const countryData = parsedData.data
                    .filter(entry => entry.LOCATION === country)
                    .map(entry => ({
                        date: new Date(entry.TIME),
                        value: parseFloat(entry.VALUE)
                    }));

                // Update the data state with country-specific data
                setData(prevData => ({
                    ...prevData,
                    [country]: countryData // Store country data under its name
                }));
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
            });
    }, []);


    // Use useEffect to fetch data for selected countries
    useEffect(() => {
        if (selectedCountry && selectedCountry.length > 0) {
            // Fetch data for each selected country
            selectedCountry.forEach(country => {
                fetchDataForCountry(country);
            });
        } else {
            setData({}); // Clear data if no countries are selected
        }
    }, [selectedCountry, fetchDataForCountry]);

    useEffect(() => {
        // Create chart here using 'data' state
        const svg = d3.select('#line-chart-container svg');
        // Clear existing chart content before rendering a new one
        svg.selectAll('*').remove();

        if (Object.keys(data).length > 0) {
            // Clear existing chart content before rendering a new one
            d3.select('#line-chart-container').select('svg').remove();

            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3
                .select('#line-chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            // Set up scales
            const x = d3.scaleTime()
                .domain(d3.extent(data[Object.keys(data)[0]], d => d.date)) // Assumes all lines have the same date range
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(Object.values(data), values => d3.max(values, v => v.value))]) // Finds the max value across all lines
                .nice()
                .range([height, 0]);

            // Create line generator
            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value));

            // Filter data for selected countries
            const filteredData = Object.entries(data).filter(([country]) =>
                selectedCountry.includes(country)
            );

            // Draw the lines for selected countries
            filteredData.forEach(([country, values]) => {
                svg.append('path')
                    .datum(values)
                    .attr('fill', 'none')
                    .attr('stroke', color(country))
                    .attr('stroke-width', 1.5)
                    .attr('d', line);
            });


            // Draw x-axis
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Draw y-axis
            svg.append('g').call(d3.axisLeft(y));
        }
    }, [data]);

    return (
        <div id="line-chart-container">
            {tooltipContent && (
                <foreignObject x={tooltipContent.x} y={tooltipContent.y} width="100" height="50">
                    <div>
                        <Tooltip title={tooltipContent.content}>
                            <span>{selectedCountry}</span>
                        </Tooltip>
                    </div>
                </foreignObject>
            )}

            {/* <h2>{selectedCountry}</h2> */}
        </div>);
};

export default LineChart;
