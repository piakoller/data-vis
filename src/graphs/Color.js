import React, { useMemo } from 'react';
import * as d3 from 'd3';

const CountyColorContext = createContext();

export function CountryColorMapper ({ countries }) {
  // Create a memoized function to generate colors for each country
  const colorMap = useMemo(() => {
    const uniqueCountries = [...new Set(countries)];
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueCountries)
      .range(d3.schemeCategory10); // You can change the color scheme here

    const countryColorMap = {};
    uniqueCountries.forEach(country => {
      countryColorMap[country] = colorScale(country);
    });

    return countryColorMap;
  }, [countries]);

  // Function to get the color for a specific country
  const getColorForCountry = country => colorMap[country];

  return (
    <div>
      {/* You can use the getColorForCountry function elsewhere in your component */}
    </div>
  );
};

export default CountryColorMapper;

import { createContext, useContext, useState } from 'react';

const SelectedCountryContext = createContext();

export function useSelectedCountry() {
  return useContext(SelectedCountryContext);
}

export function SelectedCountryProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState([]);

  return (
    <SelectedCountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </SelectedCountryContext.Provider>
  );
}