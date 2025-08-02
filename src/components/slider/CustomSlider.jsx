import React from 'react';
import { Box, Slider } from '@mui/material';


export default function CustomSlider ({ 
  isEnabled = true,
  value,
  setValue,
  step = 1,
  min,
  max,
  children,
}) {

  const handleOnSliderChange = (event, value) => {
    setValue(value);
  }

  const getBarWidth = () => {
    return `${(value - min) / (max - min) * 100}%`;
  }

  return (
    <Box className='h-8 w-full
    shrink-0
    grid place-content-center relative 
    transition-all duration-300
    border rounded border-sky-300/20 hover:border-sky-300/40 hover:bg-sky-400/20'>
      
      <Box className={`h-full w-full absolute top-0 bottom-0 
      opacity-0
      ${isEnabled ? '' : 'pointer-events-none'}`}>
        <Slider
        onChange={handleOnSliderChange}
        value={value}
        step={step}
        min={min}
        max={max} />
      </Box>

      <Box className='h-full absolute top-0 bottom-0 
      pointer-events-none
      bg-sky-400/20 rounded-[0.2rem]'
      style={{
        width: getBarWidth()
      }}/>
      
      { children }

    </Box>
  )
};