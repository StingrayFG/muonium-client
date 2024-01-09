import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { clearUser } from 'services/slice/UserSlice';
import { moveToNext, moveToPrevious } from 'services/slice/PathSlice';

export default function TopPanel () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const pathData = useSelector(state => state.path);

  const logOut = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleNextPath = () => {
    if (pathData.positionInHistory < pathData.pathHistory.length - 1) {
      dispatch(moveToNext());
    }
  }

  const handlePreviousPath = () => {
    if (pathData.positionInHistory > 0) {
      dispatch(moveToPrevious());
    }
  }

  return (
    <div className='w-full h-20 px-4 py-4 flex
      bg-gradient-to-b from-zinc-600 to-zinc-700
      border-solid border-b-2 border-zinc-800
      text-lg font-semibold font-sans text-neutral-200'>
        <div className='flex'>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-300 to-neutral-400 border-neutral-400
          hover:from-neutral-400 hover:to-neutral-500 hover:border-neutral-500       
          border-solid border-2 rounded-l-lg'
          onClick={handlePreviousPath}>
            <img src='/icons/chevron-left.svg' alt='prev' width='28' className='place-self-center'/>
          </button>
          <button className='w-12 h-12 grid
          bg-gradient-to-b from-neutral-300 to-neutral-400 border-neutral-400
          hover:from-neutral-400 hover:to-neutral-500 hover:border-neutral-500 
          border-solid border-2 rounded-r-lg'
          onClick={handleNextPath}>
          <img src='/icons/chevron-right.svg' alt='next' width='28' className='place-self-center'/>
          </button>
        </div>

        <div className='w-full h-12 pl-4 ml-4 mr-4 bg-white flex text-left text-neutral-800
          bg-gradient-to-b from-neutral-300 to-neutral-400 
          border-solid border-2 border-neutral-400 rounded-lg'>
            <p className='place-self-center'>{pathData.absolutePath}</p>
        </div>

        <div className='ml-auto flex'>
        <div className='w-72 h-12 pl-4 flex text-left
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800         
          border-solid border-2 rounded-l-md outline-none'>
            <p className='place-self-center'>
              {(driveData.spaceUsed / (1024 * 1024)).toFixed(1)} MB / {(driveData.spaceTotal / (1024 * 1024)).toFixed(1)} MB
              {' (' + (driveData.spaceUsed / driveData.spaceTotal * 100).toFixed(0) + '% full)'}
            </p>
          </div>
          <div className='w-72 h-12 pl-4 flex text-left
          bg-gradient-to-b from-neutral-700 to-neutral-800 border-neutral-800         
          border-solid border-2 outline-none'>
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