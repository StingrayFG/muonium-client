import { useEffect, useState } from 'react';
import { Box } from '@mui/material';


export default function MuoniumSpinner({ size, isInfinite, shallSpin }) {
  const usedSize = size ? size : 80;

  const [rotation, setRotation] = useState(0);
  const [shallContinueSpinning, setShallContinueSpinning] = useState(false);

  const resetRotation = () => {
    if ((rotation % 360) > 180) {
      setRotation(rotation + (360 - (rotation % 360)))
    } else {
      setRotation(rotation - (rotation % 360))
    }
  }

  const setNextRotation = () => {
    setRotation(rotation + 4.8)
    setTimeout(() => {setShallContinueSpinning(false)}, 20);
  }

  useEffect(() => {
    if (shallSpin && !shallContinueSpinning) {
      setShallContinueSpinning(true);
      setNextRotation();
    } else if (!shallSpin && !shallContinueSpinning) {
      resetRotation();
    }
  }, [shallSpin, shallContinueSpinning]);
  

  if (isInfinite) {
    return (
      <Box className={`p-[10%] transition-all duration-300`}
      style={{ 
        width: usedSize + 'px', 
        height: usedSize + 'px', 
      }}>

        <Box className={`w-full h-full mx-auto my-auto
        border-neutral-200 rounded-full
        animate-spin-custom`}
        style={{ 
          borderWidth: (usedSize / 40) + 'px'
        }}>
          <Box className='w-[20%] h-[20%] ml-[40%] mt-[-10%] 
          bg-neutral-200 rounded-full' />
        </Box>

        <Box className={`w-[25%] h-[25%] mx-auto mt-[-62.5%] top-0 left-0
        border-neutral-200 rounded-full
        animate-pulse-custom`}
        style={{ 
          borderWidth: (usedSize / 40) + 'px'
        }} />

      </Box>
    )
  } else {
    return (
      <Box className={`transition-all duration-300`}
      style={{ 
        padding: usedSize / 8 + 'px', 
        width: usedSize + 'px', 
        height: usedSize + 'px', 
      }}>

        <Box className={`w-full h-full mx-auto my-auto transition-all
        ${shallSpin ? 'duration-100' : 'duration-300'}
        border-neutral-200 rounded-full`}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          borderWidth: (usedSize / 40) + 'px'
        }}>
          <Box className='w-[20%] h-[20%] ml-[40%] mt-[-10%] 
          bg-neutral-200 rounded-full' />
        </Box>

        <Box className={`w-[25%] h-[25%] mx-auto mt-[-62.5%] transition-all top-0 left-0
        ${shallSpin ? 'duration-100' : 'duration-300'}
        border-neutral-200 rounded-full`}
        style={{ 
          opacity: `${(Math.cos(rotation / (180 / Math.PI)) * 50) + 50}%`,
          borderWidth: (usedSize / 40) + 'px'
        }} />

      </Box>
    )
  }

}