import { Box, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

import { ReactComponent as CheckLg } from 'assets/icons/check-lg.svg'


export default function CustomCheckbox ({ 
  value = false, 
  setValue,
  isEnabled = true,
  isSmall,
}) {

  const [usedValue, setUsedValue] = useState(value);

  useEffect(() => {
    if (usedValue !== value) {
      setUsedValue(value);
    }
  }, [value]);

  const handleOnClick = () => {
    setUsedValue(!usedValue);
    setValue(!usedValue);
  }

  return (
    <Box className={`h-8 relative shrink-0
    grid place-items-center
    ${isEnabled ? '' : 'pointer-events-none'}
    ${isSmall ? 'h-4 w-4' : 'h-6 w-6'}`}>

      <Box className={`absolute 
      grid
      transition-all duration-300
      border rounded 
      ${isSmall ? 'h-4 w-4' : 'h-6 w-6'}
      ${usedValue ? 'border-sky-400/40 bg-sky-400/20' : 'border-neutral-200/20 bg-neutral-200/10'}`}
      onClick={handleOnClick}>

        <CheckLg className={`place-self-center
        transition-all duration-300
        ${isSmall ? 'h-3 w-3' : 'h-5 w-5'}
        ${usedValue ? 'opacity-100' : 'opacity-0'}`} />

      </Box>

    </Box> 
  )
}