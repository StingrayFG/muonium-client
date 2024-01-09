import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { requestUpdate } from 'services/slice/PathSlice';

import FileService from 'services/FileService.jsx';

export default function FileContextMenu ({ point, file, setRenaming }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const handleDownload = async () => {
    await FileService.handleDownload(userData, file)
    .then(() => { dispatch(requestUpdate()); })
  }

  const handleCopy= async () => {
    await FileService.handleCopy(userData, file)
    .then(() => { dispatch(requestUpdate()); })
  }

  const handleRemove = async () => {
    await FileService.handleRemove(userData, file)
    .then(() => { dispatch(requestUpdate()); })
  }

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const menuHeight = 4 + 40 * 4;

  if (point.x + 192 > windowWidth) { point.x -= 192; }
  if (point.y + menuHeight > windowHeight) { point.y -= menuHeight; }
  
  return (
    <div className='w-48
    bg-gradient-to-b from-zinc-600 to-zinc-700 
    border-solid border-2 border-zinc-800 rounded-md
    text-lg font-semibold font-sans text-neutral-200' 
    style={{position: 'absolute', top: point.y, left: point.x}}>
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded'
      onClick={handleDownload}>
        <img src='/icons/download.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Download</p>
      </button>
     
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded'
      onClick={() => { setRenaming(true) }}>
        <img src='/icons/pencil.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Rename</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded'
      onClick={handleCopy}>
        <img src='/icons/files.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Make a copy</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded'
      onClick={handleRemove}>
        <img src='/icons/trash.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Move to trash</p>
      </button>
    </div>    
  );
};
