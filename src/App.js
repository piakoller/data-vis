import React from 'react';

import WorldMap from './WorldMap';
import LineChart from './LineChart';
import { SelectedCountryProvider } from './SelectedCountry';

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
    <SelectedCountryProvider>

    <div className="App">
      <header className="App-header">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Item>
                <CardContent style={{ height: '100%' }}>
                  <WorldMap key="unique-key-for-world-map"/>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    World Map
                  </Typography>
                </CardContent>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  box2
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <LineChart key="unique-key-for-world-map" />
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={8}>
              <Item>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  box 3
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </header>
    </div>
    </SelectedCountryProvider>
  );
}

export default App;
