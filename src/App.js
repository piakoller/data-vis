import React from 'react';

import MovingSlider from './graphs/Slider';
import WorldMap from './graphs/WorldMap';
import LineChart from './graphs/LineChart';
import BarChart from './graphs/BarChart';
import ScatterPlot from './graphs/ScatterPlot';

import { SelectedDataProvider } from './graphs/Selected';

import './App.css';

import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


function App() {



  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f7fbfc',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const headerStyle = {
    fontSize: '50px',
    color: '#00000099',
    fontFamily: 'Kalnia, serif',
    fontWeight: 100
  };

  const fontStyle = {
    //fontSize: '50px',
    //color: '#497cb8',
    fontFamily: 'Kalnia, serif',
  };

  return (
    <SelectedDataProvider>

      <div className="App">
        <header className="App-header">
          <p style={headerStyle}>Happiholics-Visualization</p>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ position: 'sticky', top: 0, zIndex: 999, shadow: '0px 0px 20px' }}>
                <Item>
                  <h2 style={fontStyle}>Select a year!</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <MovingSlider key="slider" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                <h2 style={fontStyle}>Scatter Plot - Alcohol Consumption and Happiness in Europe</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    box2
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                <h2 style={fontStyle}>Alcohol Consumption in Europe</h2>
                  <CardContent style={{ height: '100%' }}>
                    <WorldMap key="unique-key-for-world-map" />
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      World Map
                    </Typography>
                  </CardContent>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                <h2 style={fontStyle}>Life Expectancy in Europe</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <BarChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                <h2 style={fontStyle}>Alcohol Consumption over the years</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <LineChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <h2>Scatter Plot - Alcohol Consumption and Happiness in Europe</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <ScatterPlot key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </header>
      </div>
    </SelectedDataProvider>
  );
}

export default App;
