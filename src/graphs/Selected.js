import { createContext, useContext, useState } from 'react';

const SelectedDataContext = createContext();

export function useSelectedData() {
  return useContext(SelectedDataContext);
}

export function SelectedDataProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [hoverCountry, setHoverCountry] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1960); // Default year

  return (
    <SelectedDataContext.Provider value={{ selectedCountry, setSelectedCountry, hoverCountry, setHoverCountry, selectedYear, setSelectedYear }}>
      {children}
    </SelectedDataContext.Provider>
  );
}
