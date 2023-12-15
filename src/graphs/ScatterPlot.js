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
    const { selectedCountry, hoverCountry, setHoverCountry, selectedYear, unselectCountry, selectCountry } = useSelectedData();

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
        if (selectedYear <= 2021) {
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 550 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const xScale = d3.scaleLinear()
                .domain([0, 26])
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, 10])
                .range([height, 0]);

            function make_x_gridlines() {
                return d3.axisBottom(xScale)
                    .ticks(10)
            }


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



            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )
                .style("stroke", "#ccc")
                .style("opacity", "0.2");

            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )
                .style("stroke", "#ccc")
                .style("opacity", "0.2");

            const colorScale = d3.scaleOrdinal()
                .domain(['happiness', 'worldMap'])
                .range(['blue', 'green']);



            const circles = svg.selectAll('circle')
                .data(selectedYear < 2012 ? combined_data[2012] : combined_data[selectedYear], d => d.country);

            circles
                .transition()
                .duration(500)
                .attr('cx', d => xScale(d.alcohol))
                .attr('cy', d => yScale(d.happiness));

            circles.enter()
                .append('circle')
                .attr('r', 10)
                .attr('cx', d => xScale(d.alcohol))
                .attr('cy', d => yScale(d.happiness))
                .attr('fill', d => {
                    let color;
                    if (selectedCountry.some((selected) => selected.country === d.country)) {
                        // Use the color defined in selected.js for selected countries
                        const selected = selectedCountry.find((selected) => selected.country === d.country);
                        color = selected?.color || '#d0d0d0';
                    } else if (selectedCountry.some((selected) => selected.country !== d.country)) {
                        color = 'lightgrey';
                    } else if (d.country === '...') {
                        color = 'transparent';
                    } else if (selectCountry) {
                        color = 'grey';
                    }
                    let rgb = d3.rgb(color);
                    if(d.country === hoverCountry){
                        rgb.opacity = 1;
                    }
                    else {
                        rgb.opacity = 0.7;
                    }
                    return rgb;
                })
                .attr('stroke-width', d => { if(d.country === hoverCountry) {return 4} else {return 2} })
                .attr('stroke', d => {
                    let color;
                    if( d.country === hoverCountry){
                        color = '#214E4E';
                    }
                    else if (selectedCountry.some((selected) => selected.country === d.country)) {
                        const selected = selectedCountry.find((selected) => selected.country === d.country);
                        color = selected?.color || '#d0d0d0';
                    } else if (selectedCountry.some((selected) => selected.country !== d.country)) {
                        color = 'lightgrey';
                    } else if (d.country === '...') {
                        color = 'transparent';
                    } else if (selectCountry) {
                        color = 'grey';
                    }
                    return color; // Set the stroke color
                })
                .on('mouseover', function (event, d) {
                    handleMouseMove(event);
                    setTooltipContent(`Country: ${d.country}, Alcohol: ${d.alcohol}, Happiness: ${(d.happiness).toFixed(2)}`);
                    timer = setTimeout(() => {
                        setTooltipContent(null)
                    }, 3000); // 2000 ms = 2 seconds
                })
                .on('mouseout', () => {
                    clearTimeout(timer);
                    setTooltipContent(null)
                })
                .on('click', function (event, d) {
                    if (selectedCountry.some((selected) => selected.country === d.country)) {
                        unselectCountry(d.country);
                    } else {
                        selectCountry(d.country);
                    }
                }
                );

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
    }, [selectedYear, selectCountry]);


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
