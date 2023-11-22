import Papa from 'papaparse';

const alcohol_path = './data/alcohol_modified_extended.csv'

export const fetchCountryData = (country) => {
  return fetch(alcohol_path)
    .then(response => response.text())
    .then(csvData => {
      const parsedData = Papa.parse(csvData, { header: true });
      const countryData = parsedData.data
        .filter(entry => entry.COUNTRY === country)
        .map(entry => ({
          date: new Date(entry.YEAR),
          value: parseFloat(entry.VALUE)
        }));
      return countryData;
    })
    .catch(error => {
      console.error('Error fetching CSV:', error);
    });
};

export const fetchWorldMapData = () => {
  return fetch(alcohol_path)
    .then(response => response.text())
    .then(csvData => {
      const parsedData = Papa.parse(csvData, { header: true });
      const formattedData = {};

      parsedData.data.forEach(entry => {
        const year = parseInt(entry.YEAR);
        if (!formattedData[year]) {
          formattedData[year] = {};
        }
        formattedData[year][entry.COUNTRY] = parseFloat(entry.VALUE);
      });

      return formattedData;
    })
    .catch(error => {
      console.error('Error fetching CSV:', error);
    });
};
