import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useSelectedData } from './Selected';
import { fetchCountryData } from './DataFetcher';
import { styled } from '@mui/material/styles';

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const LineChart = () => {
    const { selectedCountry, selectedYear, setSelectedYear, hoverCountry, setHoverCountry } = useSelectedData();
    // const { countryColors, assignCountryColors } = ColorAssignerProvider();

    const [data, setData] = useState({});
    const [tooltipContent, setTooltipContent] = useState(null);
    let timer = null;

    const positionRef = React.useRef({
        x: 0,
        y: 0,
    });
    const popperRef = React.useRef(null);
    const areaRef = React.useRef(null);

    const handleMouseMove = (event) => {
        positionRef.current = { x: event.clientX, y: event.clientY };

        if (popperRef.current != null) {
            popperRef.current.update();
        }
    };


    const addTooltipContentCircle = useCallback((country, value) => {
        const selectedYearData = data[country]?.find(d => d.date.getFullYear() === selectedYear);
        const tooltipValue = selectedYearData ? `Country: ${country}, Year: ${selectedYear}, Value: ${selectedYearData.value}` : null;
        setTooltipContent(tooltipValue);
      }, [data, selectedYear]);
    
    const addTooltipContentCountry = useCallback((country) => {
        setTooltipContent(country)
    },[]);
    
    const fetchDataForCountry = useCallback(country => {
        fetchCountryData(country)
            .then(countryData => {
                setData(prevData => ({
                    ...prevData,
                    [country]: countryData
                }));
            });
    }, []);

    const getColorForSelected = (location) => {
        const selected = selectedCountry.find((selected) => selected.country === location);
        return selected?.color || '#d0d0d0';
    }

    // Use useEffect to fetch data for selected countries
    useEffect(() => {
        if (selectedCountry && selectedCountry.length > 0) {
            // Fetch data for each selected country
            selectedCountry.forEach(country => {
                fetchDataForCountry(country.country);
            });
        } else {
            setData({}); // Clear data if no countries are selected
        }
    }, [selectedCountry, fetchDataForCountry]);

    useEffect(() => {
        // Create chart here using 'data' state
        const svg = d3.select('#line-chart-container svg');
        // Clear existing chart content before rendering a new one
        svg.selectAll('*').remove();

        if (Object.keys(data).length > 0) {
            // Clear existing chart content before rendering a new one
            d3.select('#line-chart-container').select('svg').remove();

            const margin = { top: 20, right: 30, bottom: 50, left: 40 };
            const width = 1200 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3
                .select('#line-chart-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Set up scales
            const x = d3.scaleTime()
                //.domain(d3.extent(data[Object.keys(data)[0]], d => d.date)) // Assumes all lines have the same date range
                .domain([new Date("1960-01-01"), new Date("2023-12-31")])
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(Object.values(data), values => d3.max(values, v => v.value))]) // Finds the max value across all lines
                .nice()
                .range([height, 0]);

                const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                .defined(d => !isNaN(d.value))
                .curve(d3.curveMonotoneX); // or curveMonotoneY
              

            // Filter data for selected countries
            const filteredData = Object.entries(data).filter(([country]) =>
                selectedCountry.some((selected) => selected.country === country)
            );


            // Draw the lines for selected countries
            filteredData.forEach(([country, values]) => {
                const isHovered = hoverCountry === country; // Check if this country is hovered
                svg.append('path')
                    .datum(values)
                    .attr('fill', 'none')
                    .attr('stroke', hoverCountry == null ? getColorForSelected(country) : isHovered ? getColorForSelected(country) : '#d0d0d0') // Change stroke color if hovered, otherwise grey
                    .attr('stroke-width', isHovered ? 2 : 1) // Change stroke width if hovered
                    .attr('d', line)
                    .on('mouseover', (event) => {
                        handleMouseMove(event)
                        setHoverCountry(country)
                        addTooltipContentCountry(country)
                    }

                    ) // Set hoverCountry when mouse enters
                    .on('mouseout', () => {
                        setHoverCountry(null)
                        addTooltipContentCountry(null)
                    }

                    ); // Clear hoverCountry when mouse leaves

                // Find the data point for the selected year in each country's data
                const selectedYearData = values.find(d => d.date.getFullYear() === selectedYear);

                if (selectedYearData) {
                    // Display a circle at the selected year's position on the line
                    svg.append('circle')
                        .attr('cx', x(selectedYearData.date))
                        .attr('cy', y(selectedYearData.value))
                        .attr('r', 5)
                        .attr('fill', getColorForSelected(country)) // Use the color of the line
                        .attr('stroke', '#fff') // Optional: Add a stroke for better visibility
                        .attr('stroke-width', 2) // Optional: Adjust stroke width
                        .on('mouseover', (event) => {
                            handleMouseMove(event);
                            setHoverCountry(country);
                            addTooltipContentCircle(country);
                          })
                        .on('mouseout', (event) => {
                            addTooltipContentCircle(null);
                        });
                }
            });

            // Draw x-axis
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Draw y-axis
            svg.append('g').call(d3.axisLeft(y));

            // Add x-axis label
            svg.append('text')
                .attr('transform', `translate(${width / 2}, ${height - margin.bottom + 80})`) // Adjust the position as needed
                .style('text-anchor', 'middle')
                .style('font-family', "'Trebuchet MS', sans-serif")
                .style('font-size', '16px')
                .text('years');

            // Add y-axis label
            svg.append('text')
                .attr('transform', `translate(${margin.left - 68}, ${height / 2 + 125}) rotate(-90)`) // Adjust the position and rotation as needed                .style('text-anchor', 'middle')
                .style('font-family', "'Trebuchet MS', sans-serif")
                .style('font-size', '16px')
                .text('liters of pure alcohol per capita');
        }
    }, [data, selectedYear, hoverCountry]);

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "red",
        },
    }));

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
            <div id="line-chart-container" ref={areaRef}>
            </div>
        </Tooltip>
    );
};

export default LineChart;
