import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';
import { useSelectedCountry } from './SelectedCountry';


const LineChart = () => {
    const { selectedCountry, setSelectedCountry } = useSelectedCountry();

    const [data, setData] = useState({});
    console.log(selectedCountry);

    useEffect(() => {
        if (selectedCountry) {
            // Fetch and process the CSV data
            fetch('./data/merged_data.csv')
                .then(response => response.text())
                .then(csvData => {
                    const parsedData = Papa.parse(csvData, { header: true });
                    const countryData = parsedData.data
                        .filter(entry => entry.LOCATION === selectedCountry)
                        .map(entry => ({
                            date: new Date(entry.TIME),
                            value: parseFloat(entry.VALUE)
                        }));

                    setData(countryData);
                })
                .catch(error => {
                    console.error('Error fetching CSV:', error);
                });
        }
    }, [selectedCountry]);

    useEffect(() => {
        // Create chart here using 'data' state
        if (data.length > 0) {
            // Set up dimensions
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Create SVG element
            const svg = d3
                .select('#line-chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Set up scales
            const x = d3
                .scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([0, width]);

            const y = d3
                .scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .nice()
                .range([height, 0]);

            // Create line generator
            const line = d3
                .line()
                .x(d => x(d.date))
                .y(d => y(d.value));

            // Draw the line
            svg
                .append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1.5)
                .attr('d', line);

            // Draw x-axis
            svg
                .append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Draw y-axis
            svg.append('g').call(d3.axisLeft(y));
        }
    }, [data]);

    return (
    <div id="line-chart-container">
        {selectedCountry}
    </div>);
};

export default LineChart;
