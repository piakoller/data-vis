import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSelectedData } from './Selected';
import { fetchAlcoholAndHappinessData } from './DataFetcher';
import combined_data from "../components/alcohol_happiness_data.json"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const ScatterPlot = () => {
    const svgRef = useRef();
    const [data, setData] = useState();
    const [selectedYear, setSelectedYear] = useState(2012);
    const [dataPerYear, setDataPerYear] = useState();
    const [tooltipContent, setTooltipContent] = useState(null);
    const { selectedCountry, setSelectedCountry, hoverCountry, setHoverCountry, selectCountry, unselectCountry } = useSelectedData();


    useEffect(() => {
        fetchAlcoholAndHappinessData()
            .then(data => {
                setData(data);
            });

    }, []);

    useEffect(() => {
        console.log(combined_data[2012].length)
    }, [selectedYear]);


    useEffect(() => {
        if (selectedYear) {
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const xScale = d3.scaleLinear()
                .domain([0, 26]) // Assuming the years range from 2005 to 2022
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, 10]) // Assuming happiness and value fields
                .range([height, 0]);

            function make_x_gridlines() {
                return d3.axisBottom(xScale)
                    .ticks(10)
            }

            // Gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(yScale)
                    .ticks(10)
            }

            const svg = d3.select(svgRef.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);


            // Add the X gridlines
            // Add the X gridlines
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )
                .style("stroke", "#ccc") // Change the color of the gridlines
                .style("opacity", "0.2"); // Change the opacity of the gridlines

            // Add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )
                .style("stroke", "#ccc") // Change the color of the gridlines
                .style("opacity", "0.2"); // Change the opacity of the gridlines

            // Define colors for happiness and world map data
            const colorScale = d3.scaleOrdinal()
                .domain(['happiness', 'worldMap'])
                .range(['blue', 'green']); // Change colors as needed

            svg.selectAll('circle')
                .data(combined_data[selectedYear])
                .enter()
                .append('circle')
                .attr('cx', d => xScale(d.alcohol))
                .attr('cy', d => yScale(d.happiness)) // Assuming value field for world data
                .attr('r', 5)
                .attr('fill', d => {
                    if (hoverCountry === d.country) {
                        return '#1976D2'; // Change the color for the hovered country
                    } else if (selectedCountry.some((selected) => selected.country === d.country)) {
                        // Use the color defined in selected.js for selected countries
                        const selected = selectedCountry.find((selected) => selected.country === d.country);

                        return selected?.color || '#d0d0d0'
                    } else if (selectedCountry.some((selected) => selected.country !== d.country)) {
                        return 'lightgrey';
                    }
                    else if (d.country === '...') {
                        return 'transparent';
                    } else if (selectCountry){
                        return 'grey';
                    }
                })
                .on('mouseover', function (event, d) {
                    setTooltipContent(`Country: ${d.country}, Alcohol: ${d.alcohol}, Happiness: ${d.happiness}`);
                    setHoverCountry(d.country);
                })
                .on('mouseout', function () {
                    setTooltipContent(null);
                    setHoverCountry(null);
                })
                .on('click', (event, d) => {
                    const { country } = d;
                    if (!selectedCountry.some((selected) => selected.country === country) && country !== '...') {
                        selectCountry(country);
                    } else {
                        unselectCountry(country);
                    }
                })
                .style('opacity', 0)
                .transition()
                .duration(100)
                .delay((d, i) => i * 10)
                .style('opacity', 1)


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
                .text('Alcohol Consumption (liters per capita)');

            // Y-axis label
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -height / 2)
                .attr('y', -margin.left)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .text('Happiness');
        }
    }, [selectedYear, hoverCountry]);

    return (
        <Tooltip
            open={tooltipContent != null}
            title={tooltipContent}
            arrow
            placement="top"
            enterTouchDelay={0}
            interactive
            leaveTouchDelay={1500}
            disableTouchListener
            leaveDelay={200}
        >
            <svg ref={svgRef}></svg>
        </Tooltip>
    );
};

export default ScatterPlot;
