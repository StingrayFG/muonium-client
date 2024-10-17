import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useDelayedNavigate } from 'hooks/UseDelayedNavigate';
import { useMessageHandler } from 'hooks/UseMessageHandler';

import { signupUser } from 'state/slices/userSlice';

import MuoniumSpinner from 'components/spinner/MuoniumSpinner';


export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const [isAwaitingNavigation, NavigateWithDelay] = useDelayedNavigate();
  const [messageData, showMessage] = useMessageHandler(1500);

  const [formData, setFormData] = useState({
    login: { value: '', shallMoveLabel: false, isCorrect: false },
    password: { value: '', shallMoveLabel: false, isCorrect: false },
    confirmpassword: { value: '', shallMoveLabel: false, isCorrect: false }
  });
  const [awaitingAutofill, setAwaitingAutofill] = useState(true);

  const [isLoading, setIsLoading] = useState(false);


  // NAVIGATION
  useEffect(() => {
    if (userData && !isLoading) {
      navigate('/drive');
    }
  }, [])

  const goToLoginPage = () => {
    NavigateWithDelay('/login', 500)
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
          confirmpassword: {
            ...formData.confirmpassword,
            isCorrect: event.target.value === formData.confirmpassword.value,
          } 
        })
      } else {
        setFormData({ 
          ...formData, 
          [event.target.name]: {
            value: event.target.value,
            shallMoveLabel: true,
            isCorrect: true,
          },
          confirmpassword: {
            ...formData.confirmpassword,
            isCorrect: event.target.value === formData.confirmpassword.value,
          } 
        })
      }
    } else if (event.target.name === 'confirmpassword') {
      setFormData({ 
        ...formData, 
        [event.target.name]: {
          value: event.target.value,
          shallMoveLabel: true,
          isCorrect: event.target.value === formData.password.value,
          message: 'Does not match'
        } 
      })
    }
  }

  const getIsFormCorrect = () => {
    return ((formData.login.isCorrect === true) && 
    (formData.password.isCorrect === true) && 
    (formData.confirmpassword.isCorrect === true));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {login: event.target.elements.login.value, password: event.target.elements.password.value}

    if (getIsFormCorrect()) {
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
  }


  // RENDER
  return (
    <Box className='w-full h-dvh grid place-content-center'>

      <Box className={`max-w-[360px] w-full px-4 h-full grid place-items-center overflow-hidden
      animate-fadein-custom
      ${isAwaitingNavigation ? 'opacity-0' : 'opacity-100'}`}>

        <MuoniumSpinner size={100} shallSpin={isLoading}/>    
        
        <form className='w-full -mt-2 grid relative'
        onSubmit={handleSubmit} 
        onChange={updateInputLabel}
        onFocus={updateInputLabel}
        onBlur={updateInputLabel}>

          <Box>
            <p className={`absolute pointer-events-none
            ${awaitingAutofill ? '' : 'transition-all duration-300'}
            ${formData.login.shallMoveLabel ? 'font-semibold' : 'mt-8 ml-2 opacity-50'}`}>{'Login'}</p>

            <p className={`absolute pointer-events-none right-0
            transition-all duration-300
            text-rose-500
            ${(formData.login.isCorrect || !formData.login.value) ? 'opacity-0' : 'opacity-100'}`}>{'At least 4 characters'}</p>

            <input className='w-full px-2 mt-8'
              name='login'
              type='text'/>


            <p className={`absolute pointer-events-none 
            ${awaitingAutofill ? '' : 'transition-all duration-300'}
            ${formData.password.shallMoveLabel ? 'font-semibold' : 'mt-8 ml-2 opacity-50'}`}>{'Password'}</p>

            <p className={`absolute pointer-events-none right-0
            transition-all duration-300
            text-rose-500
            ${(formData.password.isCorrect || !formData.password.value) ? 'opacity-0' : 'opacity-100'}`}>{'At least 8 characters'}</p>

            <input className='w-full px-2 mt-8'
              name='password'
              type='password'/>


            <p className={`absolute pointer-events-none 
            ${awaitingAutofill ? '' : 'transition-all duration-300'}
            ${formData.confirmpassword.shallMoveLabel ? 'font-semibold' : 'mt-8 ml-2 opacity-50'}`}>{'Confirm password'}</p>

            <p className={`absolute pointer-events-none right-0
            transition-all duration-300
            text-rose-500
            ${(formData.confirmpassword.isCorrect || !formData.confirmpassword.value) ? 'opacity-0' : 'opacity-100'}`}>{'Does not match'}</p>

            <input className='w-full px-2 mt-8'
              name='confirmpassword'
              type='password' />
          </Box>
          
          <button className={`w-full h-8 mt-8 text-neutral-200
          ${getIsFormCorrect() ? '' : 'button-inactive' }`}>
            <p className={`transition-all duration-300
            font-semibold
            ${getIsFormCorrect() ? 'opacity-100' : 'opacity-40' }`}>
              {'Continue'}
            </p>
          </button >

          <Box className='flex place-self-center mt-2'>
            <p>{'Already registered?'}</p>
            <Link className='place-self-center ml-2' onClick={goToLoginPage}>
              {'Login'}
            </Link>
          </Box>

        </form>   

        <p className={`h-16 mt-0
        transition-all duration-300 
        text-rose-500 text-center
        ${messageData.isShowing ? 'opacity-100': 'opacity-0'}`}>
          {messageData.message ?  messageData.message : '_'}
        </p>              
      </Box>
      
    </Box>  
  );
}

