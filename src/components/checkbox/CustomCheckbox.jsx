import { Box, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

import { ReactComponent as CheckLg } from 'assets/icons/check-lg.svg'


export default function CustomCheckbox ({ defaultValue, setMenuValue, isContextMenuMode }) {

  const [value, setValue] = useState(defaultValue ? defaultValue : false);

  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue ? defaultValue : false);
    }
  }, [defaultValue]);

  const handleOnClick = () => {
    if (!isContextMenuMode) {
      setValue(!value);
      setMenuValue(!value);
    }
  }

  return (
    <Box className={`h-8 relative cursor-default shrink-0
    grid place-content-center place-items-center
    ${isContextMenuMode ? 'w-4' : 'w-8'}`}>

      <Box className={`absolute grid
      transition-all duration-300
      border rounded 
      ${isContextMenuMode ? 'h-4 w-4' : 'h-6 w-6'}
      ${value ? 'border-sky-400/40 bg-sky-400/20' : 'border-neutral-200/20 bg-neutral-200/10'}`}
      onClick={handleOnClick}>
        <CheckLg className={`place-self-center
        transition-all duration-300
        ${isContextMenuMode ? 'h-3 w-3' : 'h-5 w-5'}
        ${value ? 'opacity-100' : 'opacity-0'}`} />
      </Box>

    </Box> 
  )
}