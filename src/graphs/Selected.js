import { createContext, useContext, useEffect, useState } from 'react';

const SelectedDataContext = createContext();

export function useSelectedData() {
  return useContext(SelectedDataContext);
}

export function SelectedDataProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [hoverCountry, setHoverCountry] = useState(null);
  const [selectedYear, setSelectedYear] = useState(1960); // Default year

  const allCountries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan',
  'Belgium', 'Bulgaria', 'Bosnia and Herzegovina', 'Belarus',
  'Switzerland', 'Cyprus', 'Czechia', 'Germany', 'Denmark', 'Spain',
  'Estonia', 'Finland', 'France', 'United Kingdom', 'Georgia',
  'Greece', 'Croatia', 'Hungary', 'Ireland', 'Iceland', 'Israel',
  'Italy', 'Kazakhstan', 'Kyrgyzstan', 'Lithuania', 'Luxembourg',
  'Latvia', 'Moldova', 'North Macedonia', 'Malta', 'Montenegro',
  'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia',
  'Republic of Serbia', 'Slovakia', 'Slovenia', 'Sweden',
  'Tajikistan', 'Turkmenistan', 'Turkey', 'Ukraine', 'Uzbekistan']

  let colorList = ['#CC6677', '#332288', '#DDCC77', '#117733', '#88CCEE', '#882255', '#44AA99', '#999933', '#AA4499']
  const [selectedColors, setSelectedColors] = useState({
    '#77AADD': false,
    '#99DDFF': false,
    '#44BB99': false,
    '#BBCC33': false,
    '#EEDD88': false,
    '#EE8866': false,
    '#FFAABB': false,
    '#AAAA00': false,
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
    if(selectedCountry.length >= 8){
      alert("You can only select up to 8 countries")
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
    '#77AADD': false,
    '#99DDFF': false,
    '#44BB99': false,
    '#BBCC33': false,
    '#EEDD88': false,
    '#EE8866': false,
    '#FFAABB': false,
    '#AAAA00': false,
    })
  }



  return (
    <SelectedDataContext.Provider value={{ selectedCountry, setSelectedCountry, hoverCountry, setHoverCountry, selectedYear, setSelectedYear, selectCountry, unselectCountry, unselectAll, allCountries }}>
      {children}
    </SelectedDataContext.Provider>
  );
}
