import React from 'react';
import { useRef, useEffect } from "react";

import WorldMap from './WorldMap';
import './App.css';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
    <div className="App">
    {/* <header className="App-header">
        <h1 className='rainbow-text-animation'>DATA VIZARDS</h1>
      </header> */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>
              <CardContent>
              <WorldMap key="unique-key-for-world-map" />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  World Map
                </Typography>
              </CardContent>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  box 3
            </Typography>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  box 3
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
    
    </div>
  );
}

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Grid container spacing={2}>
//           <Grid item xs={8} md={6}>
//             <Card sx={{ minWidth: 500 }}>
//               <CardContent>
//               <WorldMap key="unique-key-for-world-map" />
//                 <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                   World Map
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={4} md={6}>
//             <Card sx={{ minWidth: 100 }}>
//               <CardContent>
//                 <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                   Word of the Day
//                 </Typography>
//                 <Typography variant="h5" component="div">
//                   be{bull}nev{bull}o{bull}lent
//                 </Typography>
//                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                   adjective
//                 </Typography>
//                 <Typography variant="body2">
//                   well meaning and kindly.
//                   <br />
//                   {'"a benevolent smile"'}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={4} md={6}>
//             <Card sx={{ minWidth: 275 }}>
//               <CardContent>
//                 <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                   box 3
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={8} md={6}>
//             <Card sx={{ minWidth: 275 }}>
//               <CardContent>
//                 <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                   Box 4
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </header>
//     </div>
//   );
// }

export default App;
