import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';
import { useMessageHandler } from 'hooks/UseMessageHandler';

import { signupUser } from 'state/slices/UserSlice';

import MuoniumSpinner from 'components/spinner/MuoniumSpinner';


export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();
  const [messageData, showMessage] = useMessageHandler(1500);

  const [shallMoveInputLabelsData, setShallMoveInputLabelsData] = useState({
    login: false,
    password: false,
    confirmpassword: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData && !isLoading) {
      navigate('/drive');
    }
  })

  const updateInputLabel = (event) => {
    if((!event.target.value) && (event.type === 'blur')) {
      setShallMoveInputLabelsData({ ...shallMoveInputLabelsData, [event.target.name]: false })
    } else {
      setShallMoveInputLabelsData({ ...shallMoveInputLabelsData, [event.target.name]: true })
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {login: event.target.elements.login.value, password: event.target.elements.password.value}

    if (!data.login || !data.password) {
      //showMessage('Please enter correct data');
    } else if (data.password !== event.target.elements.confirmpassword.value) {
      showMessage('Passwords do not match')
    } else {
      setIsLoading(true);
      await dispatch(signupUser(data))
      .then(res => {
        if (res.type === 'user/signup/rejected') {
          setIsLoading(false);
          const code = (res.error.message.slice(res.error.message.length - 3, res.error.message.length))
          if (code === '423') {
            showMessage('Too many signup attempts');
          } else if (code === '409') {
            showMessage('Username is already used');
          } else {
            showMessage('Something went wrong, try again later');
          }
        } else if (res.type === 'user/signup/fulfilled') {
          NavigateWithDelay('/login', 500)
        }
      })
    }
  };

  const goToLoginPage = () => {
    NavigateWithDelay('/login', 500)
  }


  return (
    <Box className='w-full h-dvh grid place-content-center'>

      <Box className={`max-w-[480px] w-full grid 
      transition-all duration-300 animate-fadein-custom
      ${isAwaitingNavigation? 'opacity-0' : 'opacity-100'}`}>

        <Box className='mx-auto -mt-6'>
          <MuoniumSpinner size={120} shallSpin={isLoading}/>    
        </Box>
        
        <form className='w-full -mt-6 px-4 py-4 grid'
        onSubmit={handleSubmit} 
        onChange={updateInputLabel}
        onFocus={updateInputLabel}
        onBlur={updateInputLabel}>

          <Box>
            <p className={`h-6 absolute pointer-events-none 
            transition-all duration-300 
            ${shallMoveInputLabelsData.login ? 'mt-4 font-semibold' : 'mt-14 ml-4 opacity-50'}`}>Login</p>

            <input className='w-full h-12 px-4 mt-12'
              name='login'
              type='text'/>

            <p className={`h-6 absolute pointer-events-none 
            transition-all duration-300 
            ${shallMoveInputLabelsData.password ? 'mt-4 font-semibold' : 'mt-14 ml-4 opacity-50'}`}>Password</p>

            <input className='w-full h-12 px-4 mt-12'
              name='password'
              type='password'/>

            <p className={`h-6 absolute pointer-events-none 
            transition-all duration-300 
            ${shallMoveInputLabelsData.confirmpassword ? 'mt-4 font-semibold' : 'mt-14 ml-4 opacity-50'}`}>Confirm password</p>

            <input className='w-full h-12 px-4 mt-12'
              name='confirmpassword'
              type='password' />
          </Box>
          
          <button className='w-full h-12 mt-12 grid text-neutral-200'>
            <p className='place-self-center font-semibold'>Continue</p>
          </button >

          <Box className='flex place-self-center mt-2'>
            <p>Already registered?</p>
            <Link className='place-self-center ml-2' onClick={goToLoginPage}>
              Login
            </Link>
          </Box>

        </form>   

        <p className={`mt-4 place-self-center transition-all duration-300 text-rose-500
        ${messageData.isShowing ? 'opacity-100': 'opacity-0'}`}>
          {messageData.message ?  messageData.message : '_'}
        </p>              
      </Box>

      
    </Box>  
  );
}

