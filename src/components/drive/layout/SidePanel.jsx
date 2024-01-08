import { useDispatch } from 'react-redux';

import { moveToNew } from 'services/slice/PathSlice';

export default function SidePanel () {
  const dispatch = useDispatch();

  const moveToPath = (path) => {
    dispatch(moveToNew({uuid: path}));
  }

  return (
    <div className='w-96 h-full
    bg-gradient-to-b from-zinc-600/90 to-zinc-700/90
    border-solid border-r-2 border-zinc-800
    text-2xl font-semibold font-sans text-neutral-200'>

      <button className='w-full h-12 px-3 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={() => {moveToPath('root')}}>
        <img src='/icons/house.svg' alt='prev' width='28' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Home</p>
      </button>

      <button className='w-full h-12 px-3 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={() => {moveToPath('trash')}}>
        <img src='/icons/trash.svg' alt='prev' width='28' className='place-self-center mt-1'/>
        <p className='ml-2 place-self-center'>Trash</p>
      </button>

    </div>
  );
}