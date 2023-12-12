import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchLifeExpectancyData } from './DataFetcher';
import { useSelectedData } from './Selected';

const BarChart = () => {
    const { selectedCountry, setSelectedCountry, selectedYear, hoverCountry, setHoverCountry, selectCountry, unselectCountry } = useSelectedData();

    const ref = useRef();
    const width = 600;
    const height = 450;
    const marginTop = 30;
    const marginBottom = 50;
    const marginLeft = 40;

    useEffect(() => {
        fetchLifeExpectancyData().then(data => {
            // Filter the data based on the selected year
            const yearData = data.filter(d => d.year === selectedYear);

            // Find the hovered country data
            const hoveredCountryData = yearData.find(d => d.country === hoverCountry);
            const selectedCountryData = selectedCountry.map(country => yearData.find(d => d.country === country.country)).filter(Boolean);

            // Sort the data by life expectancy
            yearData.sort((a, b) => d3.descending(a.lifeExpectancy, b.lifeExpectancy));

            // Take top 5 and last 5 countries
            const topData = yearData.slice(0, 5);
            const lastData = yearData.slice(-5);

            const includeHover = !topData.includes(hoveredCountryData) && !lastData.includes(hoveredCountryData);
            const includeSelected = selectedCountryData.filter(country => !topData.includes(country) && !lastData.includes(country));

            // If the hovered country or any selected country is not in the top or bottom 5, add them to the data
            if (hoveredCountryData && includeHover) {
                topData.push(hoveredCountryData);
            }

            if (includeSelected.length > 0) {
                includeSelected.forEach(country => {
                    topData.push(country);
                });
            }



            // Combine top and last data
            const combinedData = [...topData, { country: '...', lifeExpectancy: null }, ...lastData];

            // Set up scales
            const xScale = d3.scaleBand().range([0, width]).padding(0.5);
            const yScale = d3.scaleLinear().range([height - marginBottom, marginTop]);

            xScale.domain(combinedData.map(d => d.country));
            yScale.domain([50, 90]);

            const svg = d3.select(ref.current);

            // Remove existing elements
            svg.selectAll('*').remove();

            // Draw x-axis
            svg.append('g')
                .attr('transform', `translate(0, ${height - marginBottom})`)
                .call(d3.axisBottom(xScale).tickSizeOuter(0))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-35)");

            // Draw y-axis
            svg.append('g')
                .attr('transform', `translate(${marginLeft}, 0)`)
                .call(d3.axisLeft(yScale))
                .append('text')
                .attr('transform', 'rotate(-65)')
                .attr('y', -marginLeft + 20)
                .attr('x', -(height / 2))
                .attr('text-anchor', 'middle')
                .text('Life Expectancy');

            // Add values at the top of the bars
            svg.selectAll('.label')
                .data(combinedData)
                .enter().append('text')
                .attr('class', 'label')
                .attr('x', d => xScale(d.country) + xScale.bandwidth() / 2)
                .attr('y', d => yScale(d.lifeExpectancy) - 5)
                .attr('text-anchor', 'middle')
                .text(d => d.lifeExpectancy ? d.lifeExpectancy.toFixed(1) : '');

            // Draw bars
            svg.selectAll('.bar')
                .data(combinedData)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(d.country))
                .attr('y', d => d.lifeExpectancy ? yScale(d.lifeExpectancy) : height - marginBottom)
                .attr('width', xScale.bandwidth())
                .attr('height', d => d.lifeExpectancy ? height - marginBottom - yScale(d.lifeExpectancy) : 0)
                .attr('fill', d => {
                    if (hoverCountry === d.country) {
                        return 'red'; // Change the color for the hovered country
                    } else if (selectedCountry.some((selected) => selected.country === d.country)) {
                        return 'orange'; // Change the color for the selected country
                    } else if (d.country === '...') {
                        return 'transparent';
                    } else {
                        return 'steelblue';
                    }
                })
                .on('click', (event, d) => {
                    const { country } = d;
                    if (!selectedCountry.some((selected) => selected.country === country) && country !== '...') {
                        selectCountry(country);
                    } else {
                        unselectCountry(country);
                    }
                })
                .on('mouseover', (event, d) => setHoverCountry(d.country)) // Set hoverCountry when mouse enters
                .on('mouseout', () => setHoverCountry(null)); // Clear hoverCountry when mouse leaves

        });
    }, [selectedYear, setSelectedCountry, hoverCountry]);

    return <svg ref={ref} style={{ width: `${width}px`, height: `${height}px`, marginBottom: `${marginBottom}px`, marginLeft: `${marginLeft}px` }} />;
};

export default BarChart;
