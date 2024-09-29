import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import BackgroundOverlay from 'components/background/BackgroundOverlay';

import { ReactComponent as LinkBoxIcon } from 'assets/icons/box-arrow-up-right-sky.svg'


export default function LoginPage() {
  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();

  const goToLoginPage = () => {
    NavigateWithDelay('/login', 500)
  }

  return (
    <Box className='w-full h-dvh grid
    transition-all duration-300'>

      <Box className={`w-fit p-4 place-self-center
      transition-all duration-300 animate-fadein-custom
      border-solid border-2 rounded-md
      ${isAwaitingNavigation? 'opacity-0' : 'opacity-100'}`}>
        <p className='text-2xl font-semibold'>
          {'Welcome to muonium'}
        </p>

        <p className='mt-2'>
          {'To go to login page, '}
          <Link className='inline-flex gap-2 hover:underline' onClick={goToLoginPage}> 
            {'click here'}
            <LinkBoxIcon className='mt-1.5'/>
          </Link> 
        </p> 

        <p> 
          {'To find more, check the '}
          <a href='https://github.com/StingrayFG/muonium-frontend' className='inline-flex gap-2 hover:underline'>
            {'github repository'}
            <LinkBoxIcon className='mt-1.5'/>
          </a>      
        </p> 
      </Box>

    </Box>  
  );
}

