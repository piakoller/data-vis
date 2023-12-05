import React, { useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { fetchCountryData } from './DataFetcher';

const BarChart = () => {
    const [data, setData] = useState({});

    const fetchDataForCountry = useCallback(country => {
        fetchCountryData(country)
            .then(countryData => {
                setData(countryData);
            });
    }, []);

    useEffect(() => {
        fetchDataForCountry();
        console.log(data);

        // Prepare the data in the required format for D3
        const chartData = Object.entries(data).map(([year, lifeExpectancy]) => ({
            year,
            lifeExpectancy
        }));

        // Set up the SVG and chart dimensions
        const margin = { top: 20, right: 30, bottom: 40, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Append the SVG to the HTML body
        const svg = d3.select('body')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set the X and Y scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.lifeExpectancy)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(chartData.map(d => d.year))
            .range([0, height])
            .padding(0.1);

        // Draw the bars
        svg.selectAll('.bar')
            .data(chartData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => y(d.year))
            .attr('width', d => x(d.lifeExpectancy))
            .attr('height', y.bandwidth())
            .attr('fill', 'steelblue');

        // Add X and Y axis
        svg.append('g')
            .attr('class', 'x-axis')
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));
    }, []);
    return (
        <div id="line-chart-container">
            {(
                <div>

                </div>
            )}

            {/* <h2>{selectedCountry}</h2> */}
        </div>);
};
export default BarChart;
