import { useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import { createBookmark, deleteBookmark } from 'services/slice/BookmarkSlice';

import { requestUpdate } from 'services/slice/PathSlice';

import FolderService from 'services/FolderService.jsx';

export default function FolderContextMenu ({ point, folder }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);

  const handleRemove = async () => {
    await FolderService.handleRemove(userData, folder)
    .then(() => { dispatch(requestUpdate()); })
  }

  const handleCreateBookmark = async () => {
    dispatch(createBookmark({ userData, folder }));
  }

  const handleDeleteBookmark = async () => {
    dispatch(deleteBookmark({ userData, folder }));
  }
  
  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const menuWidth = 240;
  const menuHeight = 4 + 40 * 3 + 2 * 2;
  
  if (point.x + menuWidth > windowWidth) { point.x -= menuWidth; }
  if (point.y + menuHeight > windowHeight) { point.y -= menuHeight; }
  
  return (
    <div className='w-60
    bg-gradient-to-b from-zinc-600 to-zinc-700 
    border-solid border-2 border-zinc-800 rounded-md
    text-lg font-semibold font-sans text-neutral-200' 
    style={{position: 'absolute', top: point.y, left: point.x}}
    onMouseEnter={() => { contextMenuContext.setHoveredOverMenu(true) }}
    onMouseLeave={() => { contextMenuContext.setHoveredOverMenu(false) }}>
      {bookmarkData.bookmarkedFoldersUuids.includes(folder.uuid) ? 
        <button className='w-full h-10 px-2 flex text-left 
        hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
        onClick={handleDeleteBookmark}>
          <img src='/icons/star-fill.svg' alt='prev' width='20' className='place-self-center'/>
          <p className='ml-2 place-self-center'>Remove bookmark</p>
        </button>
        :
        <button className='w-full h-10 px-2 flex text-left 
        hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
        onClick={handleCreateBookmark}>
          <img src='/icons/star.svg' alt='prev' width='20' className='place-self-center'/>
          <p className='ml-2 place-self-center'>Add bookmark</p>
        </button>    
      }

      <div className='mx-1 border-solid border-t-2 border-zinc-800 border-top'></div>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={cutCopyPasteContext.handleCut}>
        <img src='/icons/clipboard-x.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Cut</p>
      </button>

      <div className='mx-1 border-solid border-t-2 border-zinc-800 border-top'></div>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={() => { contextMenuContext.setRenaming(true) }}>
        <img src='/icons/pencil.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Rename</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={handleRemove}>
        <img src='/icons/trash.svg' alt='prev' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Move to trash</p>
      </button>
    </div>    
  );
};
