import Papa from 'papaparse';

const alcohol_path = './data/Alcohol/filtered/combined_alcohol_data.csv'
const life_expectancy_path = './data/LifeExpectancy/life-expectancy-modified2.csv'
const happiness_path = './data/Happiness/happiness_europe.csv'
const alcohol_and_happiness_path = './data/alc_and_happiness_combined.csv'

export const fetchCountryData = (country) => {
  return fetch(alcohol_path)
    .then(response => response.text())
    .then(csvData => {
      const parsedData = Papa.parse(csvData, { header: true });
      const countryData = parsedData.data
        .filter(entry => entry.LOCATION === country && entry['BEVERAGE TYPES'] === 'Alltypes') // Filter by country and beverage type
        .map(entry => ({
          date: new Date(entry.TIME),
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
        const year = parseInt(entry.TIME);
        const location = entry.LOCATION;
        const beverageType = entry['BEVERAGE TYPES'];

        // Check if the beverage type is in the specified list
        if (['Wine', 'Beer', 'Spirits', 'Other alcoholic beverages', 'Alltypes'].includes(beverageType)) {
          if (!formattedData[year]) {
            formattedData[year] = {};
          }

          if (beverageType === 'Alltypes') {
            formattedData[year][location] = {
              value: parseFloat(entry.VALUE),
              color: entry.COLOR
            };
          } else {
            if (!formattedData[year][location]) {
              formattedData[year][location] = {};
            }
            formattedData[year][location][beverageType] = parseFloat(entry.VALUE);
          }
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
          const location = values[0];
          const year = parseInt(values[1]); // Adjust index to 1 for Year
          const happiness = parseFloat(values[2]); // Adjust index to 2 for Life Expectancy
          const rank = parseFloat(values[3])

          if (!isNaN(year) && location && !isNaN(happiness)) {
            formattedData.push({
              year: year,
              location: location,
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

export const fetchAlcoholAndHappinessData = () => {
  return fetch(alcohol_and_happiness_path)
    .then(response => response.text())
    .then(csvData => {
      const lines = csvData.split('\n');
      const formattedData = [];

      // Assuming the first line contains column headers
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        if (values.length === headers.length) {
          const year = parseInt(values[1]); // Adjust index to 1 for Year
          const country = values[2]
          const alcohol = parseFloat(values[3]) // Adjust index to 2 for Life Expectancy
          const happiness = parseFloat(values[4])
          const social = parseFloat(values[5])
          const freedom = parseFloat(values[6])
          const generosity = parseFloat(values[7])
          const rank = parseInt(values[8])

          if (!isNaN(year) && country && !isNaN(happiness) && !isNaN(alcohol)) {
            formattedData.push({
              year: year,
              country: country,
              happiness: happiness,
              alcohol: alcohol,
              social: social,
              freedom: freedom,
              generosity: generosity,
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
}