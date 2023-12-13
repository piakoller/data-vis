import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchHappinessData } from './DataFetcher';
import { fetchWorldMapData } from './DataFetcher';

const ScatterPlot = () => {
    const svgRef = useRef();

    useEffect(() => {
        Promise.all([fetchHappinessData(), fetchWorldMapData()])
            .then(([happinessData, worldMapData]) => {
                // Merge happinessData and worldMapData based on a common field
                const mergedData = happinessData.map(happiness => ({
                    ...happiness,
                    ...worldMapData[happiness.year]?.[happiness.country],
                    source: 'happiness', // Tag happiness data
                }));

                const worldData = Object.values(worldMapData).flatMap(Object.values).map(item => ({
                    ...item,
                    source: 'worldMap', // Tag world map data
                }));

                const allData = mergedData.concat(worldData);

                const margin = { top: 20, right: 30, bottom: 40, left: 50 };
                const width = 600 - margin.left - margin.right;
                const height = 400 - margin.top - margin.bottom;

                const xScale = d3.scaleLinear()
                    .domain([1960, 2021]) // Assuming the years range from 2005 to 2022
                    .range([0, width]);

                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(allData, d => d.happiness || d.value)]) // Assuming happiness and value fields
                    .range([height, 0]);

                const svg = d3.select(svgRef.current)
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                // Define colors for happiness and world map data
                const colorScale = d3.scaleOrdinal()
                    .domain(['happiness', 'worldMap'])
                    .range(['blue', 'green']); // Change colors as needed

                svg.selectAll('circle')
                    .data(allData)
                    .enter()
                    .append('circle')
                    .attr('cx', d => xScale(d.year))
                    .attr('cy', d => yScale(d.happiness || d.value)) // Assuming value field for world data
                    .attr('r', 5)
                    .attr('fill', d => colorScale(d.source))
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .delay((d, i) => i * 10)
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
