import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from 'services/slice/UserSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  useEffect(() => {
    if(userData) {
      navigate('/drive');
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {login: event.target.elements.login.value, password: event.target.elements.password.value}

    await dispatch(loginUser(data))
    .then(res => {
      console.log(res);
      if (!data.login || !data.password) {
        showMessage('Please enter correct data');
      } else if (res.type === 'user/login/rejected') {
        showMessage('Wrong user data');
      } else if (res.type === 'user/login/fulfilled') {
        navigate('/drive');
      }
    })
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
        bg-gradient-to-b from-zinc-500 to-zinc-600 
        border-solid border-2 border-zinc-700 rounded-md'>
          <form onSubmit={handleSubmit} className='w-full px-4 py-4 grid'>
            <p className='h-6'>Login</p>
            <input className='w-full h-12 pl-3 mt-2
            text-neutral-800
            bg-gradient-to-b from-neutral-300 to-neutral-400 
            border-solid border-2 border-neutral-400 rounded-md outline-none'
              name='login'
              type='text'/>
            <p className='h-6 mt-2'>Password</p>
            <input className='w-full h-12 pl-3 mt-2 text-neutral-800
            bg-gradient-to-b from-neutral-300 to-neutral-400 
            border-solid border-2 border-neutral-400 rounded-md outline-none'
              name='password'
              type='password'/>    
            <button className='w-full h-12 pl-3 mt-10 grid text-neutral-200
            bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800 
            hover:from-neutral-600 hover:to-neutral-700 hover:border-neutral-700           
            border-solid border-2 rounded-md outline-none'>
              <p className='place-self-center'>
                Log in
              </p>
            </button >

            <Link className='place-self-center mt-1 mb-1
            text-neutral-200 hover:text-neutral-400' to='/signup'>
              New here? Sign up
            </Link>
          </form>              
        </div>
        <p className={`place-self-center mt-2 transition-all duration-500
        ${showingMessage ? 'opacity-100': 'opacity-0'}`}>
          {'' + message}
        </p>       
      </div>  
    );
  } else {
    return null;
  }
}

