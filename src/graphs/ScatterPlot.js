import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSelectedData } from './Selected';
import { fetchAlcoholAndHappinessData } from './DataFetcher';
import combined_data from "../components/alcohol_happiness_data.json"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const ScatterPlot = () => {
    const svgRef = useRef();
    const [data, setData] = useState();
    const [dataPerYear, setDataPerYear] = useState();
    const [tooltipContent, setTooltipContent] = useState(null);
    const { selectedCountry, hoverCountry, setHoverCountry, selectedYear } = useSelectedData();

    let timer = null;

    const positionRef = React.useRef({
        x: 0,
        y: 0,
    });
    const popperRef = React.useRef(null);

    const handleMouseMove = (event) => {
        positionRef.current = { x: event.clientX, y: event.clientY };

        if (popperRef.current != null) {
            popperRef.current.update();
        }
    };

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
        if (selectedYear >= 2012 && selectedYear <= 2021) {
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

            d3.select(svgRef.current).selectAll("*").remove();

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

            // Join the new data with the old data
            const circles = svg.selectAll('circle')
                .data(combined_data[selectedYear], d => d.country); // Use the country as the key

            // For the circles that are already present, update their positions
            circles
                .transition() // Start a transition
                .duration(500) // Transition duration
                .attr('cx', d => xScale(d.alcohol)) // Animate the x position
                .attr('cy', d => yScale(d.happiness)); // Animate the y position

            // For the new circles, set their initial positions to their old positions and then transition to the new positions
            circles.enter()
                .append('circle')
                .attr('r', 5)
                .attr('fill', "blue")
                .attr('cx', d => xScale(d.alcohol)) // Set the initial x position
                .attr('cy', d => yScale(d.happiness)) // Set the initial y position
                .on('mouseover', (event, d) => {
                    handleMouseMove(event);
                    setTooltipContent(`Country: ${d.country}, Alcohol: ${d.alcohol}, Happiness: ${d.happiness}`);
                    // Clear the tooltip content after a delay
                    timer = setTimeout(() => {
                        setTooltipContent(null)
                    }, 3000); // 2000 ms = 2 seconds
                })
                .on('mouseout', () => {
                    clearTimeout(timer); // Clear the timeout if the mouse leaves before the delay
                    setTooltipContent(null) // Clear the tooltip content
                })
                .transition() // Start a transition
                .duration(500) // Transition duration
                .attr('cx', d => xScale(d.alcohol)) // Animate the x position
                .attr('cy', d => yScale(d.happiness)); // Animate the y position

            // For the circles that are no longer present, remove them
            circles.exit().remove();


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
    }, [selectedYear]);

    return (
        <Tooltip
            open={tooltipContent != null}
            title={tooltipContent}
            arrow
            placement="top"
            PopperProps={{
                popperRef,
                anchorEl: {
                    getBoundingClientRect: () => {
                        return new DOMRect(
                            positionRef.current.x,
                            positionRef.current.y,
                            0,
                            0,
                        );
                    },
                },
            }}
        >
            <svg ref={svgRef}></svg>
        </Tooltip>
    );
};

export default ScatterPlot;
