import Papa from 'papaparse';

const alcohol_path = './data/alcohol_modified_extended.csv'
const life_expectancy_path = './data/life-expectancy-modified2.csv'

export const fetchCountryData = (country) => {
  return fetch(alcohol_path)
    .then(response => response.text())
    .then(csvData => {
      const parsedData = Papa.parse(csvData, { header: true });
      const countryData = parsedData.data
        .filter(entry => entry.COUNTRY === country)
        .map(entry => ({
          date: new Date(entry.YEAR),
          value: parseFloat(entry.VALUE),
          color: entry.COLOR
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
        formattedData[year][entry.COUNTRY] = {
          value: parseFloat(entry.VALUE),
          color: entry.COLOR
        };
      });

      return formattedData;
    })
    .catch(error => {
      console.error('Error fetching CSV:', error);
    });
};

export const fetchLifeExpectancyData = () => {
  return fetch(life_expectancy_path)
    .then(response => response.text())
    .then(csvData => {
      const lines = csvData.split('\n');
      const formattedData = [];

      // Assuming the first line contains column headers
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        if (values.length === headers.length) {
          const country = values[0];
          const year = parseInt(values[1]); // Adjust index to 1 for Year
          const lifeExpectancy = parseFloat(values[2]); // Adjust index to 2 for Life Expectancy

          if (!isNaN(year) && country && !isNaN(lifeExpectancy)) {
            formattedData.push({
              year: year,
              country: country,
              lifeExpectancy: lifeExpectancy
            });
          }
        }
      }
      return formattedData;
    })
    .catch(error => {
      console.error('Error fetching CSV:', error);
    });
};


