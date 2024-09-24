import { useEffect, useState } from 'react';
import { Box } from '@mui/material';


export default function MuoniumSpinner({ size, isInfinite, shallSpin }) {
  const usedSize = size ? size : 80;

  const [startedRotatingAt, setStartedRotatingAt] = useState(null);
  const [currentRotation, setCurrentRotation] = useState(null);

  useEffect(() => {
    if (shallSpin) {
      setStartedRotatingAt(Date.now());
    } else {
      setCurrentRotation((((Date.now() - startedRotatingAt) / 1500) * 360) % 360);
    }
  }, [shallSpin])


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
      <Box className={``}
      style={{ 
        padding: usedSize / 8 + 'px', 
        width: usedSize + 'px', 
        height: usedSize + 'px', 
      }}>

        <Box className={`w-full h-full mx-auto my-auto
        ${shallSpin ? 'animate-spin' : 'animate-spin-custom'}
        border-neutral-200 rounded-full`}
        style={{
          '--fromDeg': currentRotation + 'deg',
          '--toDeg': (currentRotation > 180) ? '360deg' : '0deg',
          animationDuration: shallSpin ? '1.5s' : (((1 - Math.abs((currentRotation - 180) / 180)) / 2) * 0.5) + 's',
          borderWidth: (usedSize / 40) + 'px'
        }}>

          <Box className='w-[20%] h-[20%] ml-[40%] mt-[-10%] 
          bg-neutral-200 rounded-full' >
          </Box>

        </Box>

        <Box className={`w-[25%] h-[25%] mx-auto mt-[-62.5%] transition-all top-0 left-0
        ${shallSpin ? 'animate-pulse-0' : 'animate-pulse-custom'}
        border-neutral-200 rounded-full`}
        style={{
          '--fromOp': Math.abs((currentRotation - 180) / 180),
          '--toOp': 1,
          animationDuration: shallSpin ? '1.5s' : (((1 - Math.abs((currentRotation - 180) / 180))) * 0.5) + 's',
          borderWidth: (usedSize / 40) + 'px'
        }}>
        </Box>

      </Box>
    )
  }

}