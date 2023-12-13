import Papa from 'papaparse';

const alcohol_path = './data/Alcohol/filtered/combined_alcohol_data.csv'
const life_expectancy_path = './data/LifeExpectancy/life-expectancy-modified2.csv'
const happiness_path = './data/Happiness/happiness_europe.csv'

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

      // parsedData.data.forEach(entry => {
      //   const year = parseInt(entry.TIME);
      //   if (!formattedData[year]) {
      //     formattedData[year] = {};
      //   }
      //   formattedData[year][entry.LOCATION] = {
      //     value: parseFloat(entry.Value),
      //     color: entry.COLOR
      //   };
      // });
      parsedData.data.forEach(entry => {
        const year = parseInt(entry.TIME);
        const location = entry.LOCATION;
        const beverageType = entry['BEVERAGE TYPES'];

        if (beverageType === 'Alltypes') {
          if (!formattedData[year]) {
            formattedData[year] = {};
          }
          formattedData[year][location] = {
            value: parseFloat(entry.VALUE),
            color: entry.COLOR
          };
        }
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

export const fetchHappinessData = () => {
  return fetch(happiness_path)
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
          const happiness = parseFloat(values[2]); // Adjust index to 2 for Life Expectancy
          const rank = parseFloat(values[3])

          if (!isNaN(year) && country && !isNaN(happiness)) {
            formattedData.push({
              year: year,
              country: country,
              happiness: happiness,
              rank: rank
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