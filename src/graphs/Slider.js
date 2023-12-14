import React, { useState, useEffect } from "react";
import { useSelectedData } from './Selected';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';

const MovingSlider = () => {
    const { selectedYear, setSelectedYear } = useSelectedData();
    const [autoPlay, setAutoPlay] = useState(false);

    const fontStyle = {
        //fontSize: '50px',
        //color: '#497cb8',
        fontFamily: 'Roboto, sans-serif',
        width: 250,
    };

    useEffect(() => {
        let intervalId;

        if (autoPlay) {
            intervalId = setInterval(() => {
                setSelectedYear(prevYear => {
                    const nextYear = prevYear < 2021 ? prevYear + 1 : 1960; // Reset to 1960 after reaching 2021
                    return nextYear;
                });
            }, 500);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [autoPlay, setSelectedYear]);

    const handleSliderChange = (event, newValue) => {
        setSelectedYear(newValue);
    };

    return (
        <div id="slider">
            <div style={{ padding: 0, width: "50%", margin: "auto" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <h2 style={{ textAlign: "center", width: 200 }}>Year: {selectedYear}</h2>
                    <IconButton aria-label="Play" size="large" onClick={() => setAutoPlay(!autoPlay)}>
                        {autoPlay ? <PauseIcon color="primary" /> : <PlayArrowIcon color="primary" />}
                    </IconButton>

                    <Slider
                        value={selectedYear}
                        onChange={handleSliderChange}
                        aria-label="Year"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1960}
                        max={2021}
                        disabled={autoPlay}
                    />
                </div>
            </div>
        </div>
    );
};

export default MovingSlider;
