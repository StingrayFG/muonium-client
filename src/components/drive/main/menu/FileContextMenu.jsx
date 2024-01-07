import { useSelector } from 'react-redux';

import FileService from 'services/FileService.jsx';

export default function FileContextMenu ({ point, file, enableRenaming }) {
  const userData = useSelector(state => state.user);

  return (
    <div className='w-48
    bg-gradient-to-b from-zinc-600 to-zinc-700 
    border-solid border-2 border-zinc-800 rounded-md
    text-lg font-semibold font-sans text-neutral-200' 
    style={{position: 'absolute', top: point.y, left: point.x}}>
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={(event) => {FileService.handleDownload(userData, file)}}>
        <img src='/icons/download.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Download</p>
      </button>
     
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={enableRenaming}>
        <img src='/icons/pencil.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Rename</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={(event) => {FileService.handleCopy(userData, file)}}>
        <img src='/icons/files.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Make a copy</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={(event) => {FileService.handleRemove(userData, file)}}>
        <img src='/icons/trash.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Move to trash</p>
      </button>
    </div>    
  );
};
