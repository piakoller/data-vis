import React from 'react';
import { useRef, useEffect } from "react";

import WorldMap from './WorldMap';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function App() {

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  return (
    <div className="App">
      <header className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <WorldMap  />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Box 1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Word of the Day
                </Typography>
                <Typography variant="h5" component="div">
                  be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  box 3
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Box 4
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
