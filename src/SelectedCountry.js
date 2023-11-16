// Create a new file called SelectedCountryContext.js
import { createContext, useContext, useState } from 'react';

const SelectedCountryContext = createContext();

export function useSelectedCountry() {
  return useContext(SelectedCountryContext);
}

export function SelectedCountryProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <SelectedCountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </SelectedCountryContext.Provider>
  );
}
