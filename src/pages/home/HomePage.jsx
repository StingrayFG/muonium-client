import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';

import { ReactComponent as LinkBoxIcon } from 'assets/icons/box-arrow-up-right-sky.svg'


export default function LoginPage() {
  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();

  const goToLoginPage = () => {
    NavigateWithDelay('/login', 500)
  }

  return (
    <Box className='w-full h-dvh grid
    transition-all duration-300'>

      <Box className={`w-fit px-5 py-3 place-self-center
      transition-all duration-300 animate-fadein-custom
      border-solid border border-sky-300/20 rounded
      ${isAwaitingNavigation? 'opacity-0' : 'opacity-100'}`}>
        <p className='text-2xl font-semibold'>
          {'Welcome to muonium!'}
        </p>

        <p className='mt-2'>
          {'To go to login page, '}
          <Link className='inline-flex gap-2 hover:underline' onClick={goToLoginPage}> 
            {'click here'}
            <LinkBoxIcon className='mt-[0.45rem]' style={{ color: '#0ea5e9' }}/>
          </Link> 
        </p> 

        <p> 
          {'To find more, check the '}
          <a href='https://github.com/StingrayFG/muonium-client' className='inline-flex gap-2 hover:underline'>
            {'github repository'}
            <LinkBoxIcon className='mt-[0.45rem]' style={{ color: '#0ea5e9' }}/>
          </a>      
        </p> 
      </Box>

    </Box>  
  );
}

