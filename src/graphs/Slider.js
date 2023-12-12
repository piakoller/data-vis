import React, { useState, useEffect } from "react";
import { useSelectedData } from './Selected';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

const MovingSlider = () => {
    const { selectedYear, setSelectedYear } = useSelectedData();
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        let intervalId;

        if (autoPlay) {
            intervalId = setInterval(() => {
                setSelectedYear(prevYear => {
                    const nextYear = prevYear < 2016 ? prevYear + 1 : 1960; // Reset to 1960 after reaching 2016
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
            <div style={{ padding: 20, width: "50%", margin: "auto" }}>
                <Slider
                    value={selectedYear}
                    onChange={handleSliderChange}
                    aria-label="Year"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1960}
                    max={2022}
                    disabled={autoPlay}
                />
                <h2>Year: {selectedYear}</h2>
                <Button variant="text" onClick={() => setAutoPlay(!autoPlay)}>
                    {autoPlay ? 'Pause' : 'Play'} Animation
                </Button>
            </div>
        </div>
    );
};

export default MovingSlider;
