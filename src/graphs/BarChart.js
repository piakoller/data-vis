import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchLifeExpectancyData } from './DataFetcher';
import { useSelectedData } from './Selected';

const BarChart = () => {
    const { selectedCountry, setSelectedCountry, selectedYear } = useSelectedData();

    const ref = useRef();
    const width = 700;
    const height = 325;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    useEffect(() => {
        fetchLifeExpectancyData().then(data => {
            // Filter the data based on the selected year
            const yearData = data.filter(d => d.year === selectedYear);

            // Sort the data by life expectancy and take the top 15
            yearData.sort((a, b) => d3.descending(a.lifeExpectancy, b.lifeExpectancy));
            const topData = yearData.slice(0, 15);

            // Set up scales
            const xScale = d3.scaleBand().range([0, width]).padding(0.5);
            const yScale = d3.scaleLinear().range([height - marginBottom, marginTop]);

            xScale.domain(topData.map(d => d.country));
            yScale.domain([0, d3.max(topData, d => d.lifeExpectancy)]);

            const svg = d3.select(ref.current);

            // Remove existing elements
            svg.selectAll('*').remove();

            // Draw x-axis
            svg.append('g')
                .attr('transform', `translate(0, ${height - marginBottom})`)
                .call(d3.axisBottom(xScale))
                .append('text')
                .attr('x', width / 2)
                .attr('y', marginTop - 10)
                .attr('text-anchor', 'middle')
                .text('Country');

            // Draw y-axis
            svg.append('g')
                .attr('transform', `translate(${marginLeft}, 0)`)
                .call(d3.axisLeft(yScale))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -marginLeft + 10)
                .attr('x', -(height / 2))
                .attr('text-anchor', 'middle')
                .text('Life Expectancy');

            // Draw bars
            svg.selectAll('.bar')
                .data(topData)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(d.country))
                .attr('y', d => yScale(d.lifeExpectancy))
                .attr('width', xScale.bandwidth() * 0.5)
                .attr('height', d => height - marginBottom - yScale(d.lifeExpectancy))
                .attr('fill', 'steelblue');
        });
    }, [selectedYear]);

    return <svg ref={ref} style={{ width: `${width}px`, height: `${height}px` }} />;
};

export default BarChart;
