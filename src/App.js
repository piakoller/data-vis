import React from 'react';

import MovingSlider from './graphs/Slider';
import WorldMap from './graphs/WorldMap';
import LineChart from './graphs/LineChart';
import BarChart from './graphs/BarChart';
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
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <SelectedDataProvider>

      <div className="App">
        <header className="App-header">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Item>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <MovingSlider key="slider" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
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
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <BarChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <LineChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    box2
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
