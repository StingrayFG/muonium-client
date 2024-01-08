import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from 'services/slice/UserSlice';

export default function TopPanel () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const logOut = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <div className='w-full h-20 px-4 py-4 flex
      bg-gradient-to-b from-zinc-600 to-zinc-700
      border-solid border-b-2 border-zinc-800
      text-lg font-semibold font-sans text-neutral-200'>
        <div className='flex'>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-300 to-neutral-400 
          border-solid border-2 border-neutral-400 rounded-l-lg'>
            <img src='/icons/chevron-left.svg' alt='prev' width='28' className='place-self-center'/>
          </button>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-300 to-neutral-400 
          border-solid border-2 border-neutral-400 rounded-r-lg'>
          <img src='/icons/chevron-right.svg' alt='next' width='28' className='place-self-center'/>
          </button>
        </div>

        <div className='w-full h-12 pl-4 ml-4 mr-4 bg-white flex text-left text-neutral-800
          bg-gradient-to-b from-neutral-300 to-neutral-400 
          border-solid border-2 border-neutral-400 rounded-lg'>
            <p className='place-self-center'>Route</p>
        </div>

        <div className='ml-auto flex'>
          <div className='w-60 h-12 pl-4 flex text-left
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800         
          border-solid border-2 rounded-l-md outline-none'>
            <p className='place-self-center'>{userData.login}</p>
          </div>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800 
          hover:from-neutral-600 hover:to-neutral-700 hover:border-neutral-700           
          border-solid border-2 rounded-r-md outline-none'
          onClick={logOut}>
            <img src='/icons/box-arrow-right.svg' alt='prev' width='28' className='place-self-center'/>
          </button >    
        </div>
        
    </div>
  );
}