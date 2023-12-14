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
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Modal from '@mui/material/Modal';

function App() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f7fbfc',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <SelectedDataProvider>
      <div className="App">
        <header className="App-header">
          <p id='headerstyle'>Happiholics-Visualization</p>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ position: 'sticky', top: 0, zIndex: 999, shadow: '0px 0px 20px' }}>
              <Item style={{position: "relative"}}>
                  <IconButton aria-label="info" size="large" style={{position: "absolute", top: 0, right: 0, shadow: '0px 0px 20px' }} onClick={handleOpen}>
                    <InfoIcon color='blue' />
                  </IconButton>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Data Explanation
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <p>Alcohol Data is provided by the World Health Organization:</p>
                        <p>Alcohol consumption is defined as annual sales of pure alcohol in litres per person aged 15 years and older. Alcohol use is associated with numerous harmful health and social consequences, including an increased risk of a range of cancers, stroke and liver cirrhosis. Alcohol also contributes to death and disability through accidents and injuries, assault, violence, homicide and suicide.
                        </p>
                        <p>The Happiness Data is provided by the World Happiness Report:</p>
                        <p>The World Happiness Report is a publication of the Sustainable Development Solutions Network, powered by the Gallup World Poll data. The World Happiness Report reflects a worldwide demand for more attention to happiness and well-being as criteria for government policy. It reviews the state of happiness in the world today and shows how the science of happiness explains personal and national variations in happiness.
                        </p>
                      </Typography>
                    </Box>
                  </Modal>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <MovingSlider key="slider" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                <h2 id='fontstyle'>Alcohol Consumption in Europe</h2>
                  <CardContent style={{ height: '100%' }}>
                    <WorldMap key="unique-key-for-world-map" />
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      
                    </Typography>
                  </CardContent>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                <h2 id='fontstyle'>Life Expectancy in Europe</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <BarChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                <h2 id='fontstyle'>Alcohol Consumption over the years</h2>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <LineChart key="unique-key-for-world-map" />
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <h2 id='fontstyle'>Scatter Plot - Alcohol Consumption and Happiness in Europe</h2>
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
