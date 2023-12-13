import { createContext, useContext, useEffect, useState } from 'react';

const SelectedDataContext = createContext();

export function useSelectedData() {
  return useContext(SelectedDataContext);
}

export function SelectedDataProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [hoverCountry, setHoverCountry] = useState(null);
  const [selectedYear, setSelectedYear] = useState(1960); // Default year
  let colorList = ['#CC6677', '#332288', '#DDCC77', '#117733', '#88CCEE', '#882255', '#44AA99', '#999933', '#AA4499']
  const [selectedColors, setSelectedColors] = useState({
    '#00ff00': false,
    '#ff4500': false,
    '#b03060': false,
    '#ffd700': false,
    '#000080': false,
    '#ff1493': false,
    '#00bfff': false,
    '#00ffff': false,
    '#006400': false,
  });
  const pickColor = () => {
    const colorKeys = Object.keys(selectedColors);
    console.log(colorKeys)
    const firstFalseColor = colorKeys.find(color => !selectedColors[color]);
    console.log(firstFalseColor)
    if (firstFalseColor) {
      setSelectedColors(prevColors => ({
        ...prevColors,
        [firstFalseColor]: true
      }));

      return firstFalseColor;
    }

    return null;
  };



  const selectCountry = (country) => {
    if(selectedCountry.length >= 9){
      alert("You can only select up to 9 countries")
      return
    }
    let color = pickColor();
    console.log(color)
    let newCountry = { country: country, color: color };
    console.log(newCountry)
    setSelectedCountry([...selectedCountry, newCountry]);
  }

  const unselectCountry = (country) => {
    setSelectedCountry(selectedCountry.filter((selected) => selected.country !== country));
    setSelectedColors(prevColors => ({
      ...prevColors,
      [selectedCountry.find((selected) => selected.country === country).color]: false
    }));
  }

  const unselectAll = () => {
    setSelectedCountry([]);
    setSelectedColors({
      '#00ff00': false,
      '#ff4500': false,
      '#b03060': false,
      '#ffd700': false,
      '#000080': false,
      '#ff1493': false,
      '#00bfff': false,
      '#00ffff': false,
      '#006400': false,
    })
  }



  return (
    <SelectedDataContext.Provider value={{ selectedCountry, setSelectedCountry, hoverCountry, setHoverCountry, selectedYear, setSelectedYear, selectCountry, unselectCountry, unselectAll }}>
      {children}
    </SelectedDataContext.Provider>
  );
}
