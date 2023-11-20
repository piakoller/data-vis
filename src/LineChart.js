import React, { useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';
import { useSelectedCountry } from './SelectedCountry';

import Tooltip from '@mui/material/Tooltip';

const LineChart = () => {
    const { selectedCountry } = useSelectedCountry();

    const [data, setData] = useState({});
    const [tooltipContent, setTooltipContent] = useState(null);

    const fetchDataForCountry = useCallback(
        country => {
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
                    return countryData;
                })
                .then(countryData => {
                    setData(prevData => [...prevData, ...countryData]);
                })
                .catch(error => {
                    console.error('Error fetching CSV:', error);
                });
        },
        []
    );

    useEffect(() => {
        if (selectedCountry && selectedCountry.length > 0) {
            // Fetch and process the CSV data for each selected country
            setData([]); // Clear existing data
            selectedCountry.forEach(country => {
                fetchDataForCountry(country);
            });
        } else {
            setData([]); // Clear data if no countries are selected
        }
    }, [selectedCountry, fetchDataForCountry]);

    useEffect(() => {
        // Create chart here using 'data' state
        if (data.length > 0) {
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

            // Group data by country
            const groupedData = data.reduce((acc, cur) => {
                if (!acc[cur.LOCATION]) {
                    acc[cur.LOCATION] = [];
                }
                acc[cur.LOCATION].push(cur);
                return acc;
            }, {});

            const color = d3.scaleOrdinal(d3.schemeCategory10);
            console.log(data);

            // Set up scales
            const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.date))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .nice()
                .range([height, 0]);

            // Create line generator
            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value));

            // Draw multiple lines based on grouped data
            Object.entries(groupedData).forEach(([country, countryData]) => {
                svg.append('path')
                    .datum(countryData)
                    .attr('fill', 'none')
                    .attr('stroke', color(country)) // Use country as a unique identifier for color
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
