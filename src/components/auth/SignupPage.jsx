import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { signupUser } from 'services/slice/UserSlice';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  useEffect(() => {
    if (userData) {
      navigate('/drive');
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {login: event.target.elements.login.value, password: event.target.elements.password.value}

    if (!data.login || !data.password) {
      showMessage('Please enter correct data');
    } else if (data.password !== event.target.elements.confirmpassword.value) {
      showMessage('Passwords do not match')
    } else {
      await dispatch(signupUser(data))
      .then(res => {
        if (res.type === 'user/signup/rejected') {
          const code = (res.error.message.slice(res.error.message.length - 3, res.error.message.length))
          if (code === '423') {
            showMessage('Too many signup attempts');
          } else if (code === '409') {
            showMessage('Username is already used');
          } else {
            showMessage('Something went wrong');
          }
        } else if (res.type === 'user/signup/fulfilled') {
          navigate('/login');
        }
      })
    }
    
  };

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [showingMessage, setShowingMessage] = useState();
  const [message, setMessage] = useState();

  const showMessage = async (msg) => {
    setMessage(msg);
    setShowingMessage(true);
    await delay(1500);
    setShowingMessage(false);
  };
  
  if (!userData) {
    return (
      <div className='w-full h-screen place-content-center grid
      bg-gradient-to-b from-neutral-900/75 to-neutral-100/75
      text-lg font-semibold font-sans text-neutral-200'>
        <div className='w-96 h-auto grid
        bg-gradient-to-b from-zinc-600/50 to-zinc-700/50 
        border-solid border-2 border-zinc-800 rounded-md'>
          <form onSubmit={handleSubmit} className='w-full px-4 py-4 grid'> 
            <p className='h-6'>Login</p> 
            <input className='w-full h-12 pl-3 mt-2
            text-neutral-800
            bg-gradient-to-b from-neutral-300 to-neutral-400 
            border-solid border-2 border-neutral-400 rounded-md outline-none'
              name='login'
              type='text'/>
            <p className='h-6 mt-4'>Password</p>
            <input className='w-full h-12 pl-3 mt-2 text-neutral-800
            bg-gradient-to-b from-neutral-300 to-neutral-400 
            border-solid border-2 border-neutral-400 rounded-md outline-none'
              name='password'
              type='password'/>  
            <p className='h-6 mt-4'>Repeat password</p> 
            <input className='w-full h-12 pl-3 mt-2 text-neutral-800
            bg-gradient-to-b from-neutral-300 to-neutral-400 
            border-solid border-2 border-neutral-400 rounded-md outline-none'
              name='confirmpassword'
              type='password'/> 
            <button className='w-full h-12 pl-3 mt-12 grid text-neutral-200
            bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800
            hover:bg-gradient-to-b hover:from-sky-200/75 hover:to-sky-400/60 hover:border-sky-400/75         
            border-solid border-2 rounded-lg outline-none'>
              <p className='place-self-center'>Sign up</p>
            </button >

            <Link className='place-self-center mt-1 mb-1
            text-neutral-200 hover:text-neutral-400' to='/login'>
              Already registered? Log in
            </Link>
          </form>              
        </div>
        <p className={`place-self-center mt-2 transition-all duration-500
        ${showingMessage ? 'opacity-100': 'opacity-0'}`}>
          {'' + message}
        </p>       
      </div>  
    ) 
  } else {
    return null;
  }
}

