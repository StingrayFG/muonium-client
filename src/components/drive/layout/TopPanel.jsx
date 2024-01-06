import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from 'services/UserSlice';

export default function TopPanel () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const logOut = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <div className='w-full h-24 px-4 py-4 flex
      bg-gradient-to-b from-neutral-600 to-neutral-700
      border-solid border-b-2 border-black'>
        <button className='w-16 h-16
        bg-white'>
          Prev
        </button>
        <button className='w-16 h-16 ml-4
        bg-white'>
          Next
        </button>
        <div className='w-[100rem] h-16 ml-64 bg-white'>
          <p className='mt-5 ml-5'>Route</p>
        </div>
        <div className='h-16 w-64 mr-4 ml-auto bg-white '>
          <p className='mt-5 ml-5'>{userData.login}</p>
        </div>
        <button className='w-16 
        bg-white'
        onClick={logOut}>
          Logout
        </button>
    </div>
  );
}