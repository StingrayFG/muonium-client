import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';
import { useMessageHandler } from 'hooks/UseMessageHandler';

import { loginUser } from 'state/slices/userSlice';

import MuoniumSpinner from 'components/spinner/MuoniumSpinner';


export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();
  const [messageData, showMessage, hideMessage] = useMessageHandler(1500);

  const [formData, setFormData] = useState({
    login: { value: '', shallMoveLabel: false, isCorrect: false },
    password: { value: '', shallMoveLabel: false, isCorrect: false }
  });
  const [awaitingAutofill, setAwaitingAutofill] = useState(true);

  const [isLoading, setIsLoading] = useState(false);


  // NAVIGATION
  useEffect(() => {
    if (userData && !isLoading) {
      navigate('/drive');
    }
  }, [])
  
  const goToSignupPage = () => {
    NavigateWithDelay('/signup', 500)
  }


  // FORM
  useEffect(() => {
    setTimeout(() => setAwaitingAutofill(false), 300);
  }, [])

  const updateInputLabel = (event) => {
    if((!event.target.value) && (event.type === 'blur')) {
      setFormData({ 
        ...formData, 
        [event.target.name]: {
          value: event.target.value,
          shallMoveLabel: false,
          isCorrect: true
        } 
      })
    } else if (event.target.name === 'login') {
      if (event.target.value.length < 4) {
        setFormData({ 
          ...formData, 
          [event.target.name]: {
            value: event.target.value,
            shallMoveLabel: true,
            isCorrect: false,
          }
        })
      } else {
        setFormData({  
          ...formData, 
          [event.target.name]: {
            value: event.target.value,
            shallMoveLabel: true,
            isCorrect: true,
          }
        })      
      }
    } else if (event.target.name === 'password') {
      if (event.target.value.length < 8) {
        setFormData({ 
          ...formData, 
          [event.target.name]: {
            value: event.target.value,
            shallMoveLabel: true,
            isCorrect: false,
          },
        })
      } else {
        setFormData({ 
          ...formData, 
          [event.target.name]: {
            value: event.target.value,
            shallMoveLabel: true,
            isCorrect: true,
          },
        })
      }
    }
  }

  const getIsFormCorrect = () => {
    return ((formData.login.isCorrect === true) && 
    (formData.password.isCorrect === true));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      login: formData.login.value, 
      password: formData.password.value
    }
    
    if (getIsFormCorrect()) {
      setIsLoading(true);
      await dispatch(loginUser(data))
      .then(res => {
        if (res.type === 'user/login/rejected') {
          setIsLoading(false);
          const code = (res.error.message.slice(res.error.message.length - 3, res.error.message.length))
          if (code === '423') {
            showMessage('Too many login attempts');
          } else if (code === '404') {
            showMessage('Wrong login and / or password');
          } else {
            showMessage('Something went wrong, try again later');
          }
        } else if (res.type === 'user/login/fulfilled') {
          NavigateWithDelay('/drive', 500);
        }
      })
    }    
  }


  // RENDER
  return (
    <Box className='w-full h-dvh grid place-content-center'>

      <Box className={`max-w-[400px] w-screen px-4 h-full grid place-items-center overflow-hidden
      transition-all duration-300
      animate-fadein-custom
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}>

        <MuoniumSpinner size={100} shallSpin={isLoading}/>
        
        <form className='w-full -mt-2 grid relative'
        onSubmit={handleSubmit} 
        onChange={updateInputLabel}
        onFocus={updateInputLabel}
        onBlur={updateInputLabel}>

          <Box className='relative mt-8'>
            <p className={`absolute pointer-events-none 
            ${awaitingAutofill ? '' : 'transition-all duration-300'}
            ${formData.login.shallMoveLabel ? '-top-7 left-0 font-semibold' : 'top-1 left-2 opacity-50'}`}>
              {'Login'}
            </p>

            <input className='w-full px-2'
            name='login'
            type='text'/>
          </Box>

          <Box className='relative mt-8'>
            <p className={`absolute pointer-events-none 
            ${awaitingAutofill ? '' : 'transition-all duration-300'}
            ${formData.password.shallMoveLabel ? '-top-7 left-0 font-semibold' : 'top-1 left-2 opacity-50'}`}>
              {'Password'}
            </p>

            <input className='w-full px-2'
            name='password'
            type='password'/>
          </Box>
          
          <Box className={`button-common mt-8 min-w-full
          ${getIsFormCorrect() ? '' : 'button-common-inactive' }`}
          onClick={handleSubmit}>
            <p className={`transition-all duration-300
            font-semibold
            ${getIsFormCorrect() ? 'opacity-100' : 'opacity-40' }`}>
              {'Continue'}
            </p>
          </Box >

          <Box className='flex place-self-center mt-4'>
            <p className='mt-1'>
              {'New here?'}
            </p>

            <Link className='place-self-center ml-2' onClick={goToSignupPage}>
              {'Create an account'}     
            </Link>
          </Box>

        </form>     

        <p className={`h-16 mt-2
        transition-all duration-300 
        text-rose-500 text-center
        ${messageData.isShowing ? 'opacity-100': 'opacity-0'}`}>
          {messageData.message ?  messageData.message : '_'}
        </p>            
      </Box>
      
    </Box>  
  );
}

