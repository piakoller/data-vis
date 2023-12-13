import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchHappinessData } from './DataFetcher';

const ScatterPlot = () => {
    const svgRef = useRef();

    useEffect(() => {
        fetchHappinessData().then(data => {
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const xScale = d3.scaleLinear()
                .domain([2005, 2022]) // Assuming the years range from 2005 to 2022
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.happiness)]) // Assuming happiness values
                .range([height, 0]);

            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

            svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(d.year))
                .attr('cy', d => yScale(d.happiness))
                .attr('r', 5) // Adjust the radius as needed
                .attr('fill', d => colorScale(d.country))
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .delay((d, i) => i * 10) // Adding delay for each circle
                .style('opacity', 1);

            // X-axis
            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

            // Y-axis
            svg.append('g')
                .call(d3.axisLeft(yScale));

            // X-axis label
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.top + 10)
                .style('text-anchor', 'middle')
                .text('Year');

            // Y-axis label
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -height / 2)
                .attr('y', -margin.left)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .text('Happiness');

        });
    }, []);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default ScatterPlot;
