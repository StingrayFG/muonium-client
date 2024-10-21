import { Box, Checkbox } from '@mui/material';
import { useState } from 'react';

import { ReactComponent as CheckLg } from 'assets/icons/check-lg.svg'


export default function CustomCheckbox ({ defaultValue, setMenuValue }) {

  const [value, setValue] = useState(defaultValue ? defaultValue : false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setMenuValue(newValue);
  }

  return (
    <Box className='h-8 w-8 relative 
    grid place-content-center place-items-center'>
      <Checkbox className='opacity-0'
      onChange={handleChange}
      checked={value}
      />

      <Box className={`h-6 w-6 absolute pointer-events-none
      grid place-items-center
      transition-all duration-300
      border rounded-[0.3rem] 
      ${value ? 'border-sky-400/40 bg-sky-400/20' : 'border-neutral-200/20 bg-neutral-200/10'}`}>
        <CheckLg className={`h-5 w-5
        transition-all duration-300
        ${value ? 'opacity-100' : 'opacity-0'}`} />
      </Box>

    </Box> 
  )
}