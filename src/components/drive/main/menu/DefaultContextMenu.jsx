import { useSelector } from 'react-redux';

import FolderService from 'services/FolderService.jsx';

export default function DefaultContextMenu ({ point, createFolder }) {
  const userData = useSelector(state => state.user);

  return (
    <div className='w-48
    bg-gradient-to-b from-zinc-600 to-zinc-700 
    border-solid border-2 border-zinc-800 rounded-md
    text-lg font-semibold font-sans text-neutral-200' 
    style={{position: 'absolute', top: point.y, left: point.x}}>
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-zinc-400 hover:to-zinc-500 rounded-md'
      onClick={createFolder}>
        <img src='/icons/file-plus.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>New folder</p>
      </button>
    
    </div>    
  );
};
