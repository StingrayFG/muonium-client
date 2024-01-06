import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const userData = sessionStorage.getItem('user');

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [showingMessage, setShowingMessage] = useState();
  const [message, setMessage] = useState();

  const showMessage = async (msg) => {
    setMessage(msg);
    setShowingMessage(true);
    await delay(1500);
    setShowingMessage(false);
  };

  useEffect(() => {
    if(userData) {
      navigate('/drive');
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formUserData = {login: event.target.elements.login.value, password: event.target.elements.password.value}
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/login', {userData: formUserData})
      .then(res => {
        sessionStorage.setItem('user', JSON.stringify({login: event.target.elements.login.value, accessToken: res.data.accessToken,
          userUuid: res.data.userUuid, driveUuid: res.data.driveUuid}));  
        navigate('/drive');      
      })
      .catch(err => {
        showMessage('Wrong user data');
      });
  };
  
  if (!userData) {
    return (
      <div className='w-full h-screen place-content-center grid
      text-xl font-sans text-neutral-200'>
        <div className='w-96 h-auto grid
        bg-neutral-700
        border-solid border-2 border-neutral-200 rounded-lg'>
          <form onSubmit={handleSubmit} className='w-full px-2 py-2 grid'>
            <input className='w-full h-10 pl-2 pb-1
            bg-neutral-700
            border-solid border-2 border-neutral-200 rounded-md outline-none '
              placeholder='Login'
              name='login'
              type='text'/>
            <input className='w-full h-10 pl-2 pb-1 mt-2
            bg-neutral-700
            border-solid border-2 border-neutral-200 rounded-md outline-none '
              placeholder='Password'
              name='password'
              type='password'/>    
            <button className='w-full h-10 pl-2 pb-1 mt-6
            bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 font-sans text-neutral-200 
            border-solid border-2 border-neutral-200 rounded-md outline-none'>
              <p className='place-self-center'>
                Log in
              </p>
            </button >

            <Link className='place-self-center mt-2' to='/signup'>
              Sign up
            </Link>
          </form>              
        </div>
        <p className={`place-self-center mt-2 transition-all duration-250
        ${showingMessage ? 'opacity-100': 'opacity-0'}`}>
          {'' + message}
        </p>       
      </div>  
    );
  } else {
    return null;
  }
}

