import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSelectedData } from './Selected';
import data_pie from "../components/alcohol_data_pie.json"

// Parse the JSON data
function parseData(data, year, country) {
    let parsedData = [];
    let countryData = data[year][country];

    for (let beverage in countryData) {
        if (countryData[beverage] !== null && beverage !== "alltypes" && countryData[beverage] !== 0) {
            parsedData.push({
                beverage: beverage,
                value: countryData[beverage]
            });
        }
    }

    return parsedData;
}

// PieChart component
function PieChart({ data, color, setHoverCountry, country }) {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const radius = Math.min(width, height) / 2;


        const pie = d3.pie()
            .value(d => d.value);

        const arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const path = g.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", d => color(d.data.beverage))
            .attr("d", arc)
            .on("mouseover", function (d) {
                setHoverCountry(country);
            })
            .on("mouseout", function (d) {
                setHoverCountry(null);
            });


        // Calculate the total value of all slices
        const total = data.reduce((sum, d) => sum + d.value, 0);

        // Append text elements to the slices
        g.selectAll("text")
            .data(pie(data))
            .enter().append("text")
            .attr("transform", d => "translate(" + arc.centroid(d) + ")")
            .attr("dy", ".35em")
            .text(d => `${Math.round(100 * d.data.value / total)}%`);

    }, [data]);

    return <svg ref={ref} width={200} height={200} />;
}

function Legend({ data, color }) {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = +svg.attr("width");

        // Create a legend
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0,0)");

        legend.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", (d, i) => i * 80) // change here
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => color(d.beverage));

        legend.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", (d, i) => i * 80 + 18) // and here
            .attr("y", 12.5)
            .text(d => (d.beverage).charAt(0).toUpperCase() + (d.beverage).slice(1));
    }, [data, color]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg ref={ref} width={430} height={20} />
        </div>
    );
}

const PieChartHandler = () => {
    const [parsedData, setParsedData] = useState([]);
    const { selectedCountry, setSelectedCountry, selectedYear, hoverCountry, setHoverCountry, selectCountry, unselectCountry, unselectAll } = useSelectedData();
    const color = d3.scaleOrdinal()
        .domain(['beer', 'wine', 'spirits', 'other alcoholic beverages'])
        .range(['#f28e1c', '#9a4191', '#e84b65', '#004488']);
    const legendData = [
        { beverage: 'beer' },
        { beverage: 'wine' },
        { beverage: 'spirits' },
        { beverage: 'other alcoholic beverages' }
    ];


    useEffect(() => {
        if (selectedCountry.length === 0) {
            setParsedData([]);
            return
        }
        setParsedData(selectedCountry.map(country => parseData(data_pie, selectedYear, country.country)));
    }, [data_pie, selectedYear, selectedCountry]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {parsedData[0] && <Legend data={legendData} color={color} />}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center", alignItems: "center" }}>
                {parsedData.map((data, index) => {
                    if (selectedCountry[index]) {
                        return data.length > 0 && (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <h2>{selectedCountry[index].country}</h2>
                                <PieChart data={data} color={color} setHoverCountry={setHoverCountry} country={selectedCountry[index].country} />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default PieChartHandler;