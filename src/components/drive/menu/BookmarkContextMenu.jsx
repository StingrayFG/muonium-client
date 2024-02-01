import { useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ContextMenuContext } from 'components/drive/context/ContextMenuContext.jsx';

import { deleteBookmark } from 'services/slice/BookmarkSlice';

export default function BookmarkContextMenu ({ point, bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const handleDelete = () => {
    console.log(bookmark)
    dispatch(deleteBookmark({ userData, folder: bookmark.folder }));
  }

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const menuWidth = 240;
  const menuHeight = 4 + 40 * 1 + 2 * 0;
  
  if (point.x + menuWidth > windowWidth) { point.x -= menuWidth; }
  if (point.y + menuHeight > windowHeight) { point.y -= menuHeight; }

  return (
    <div className='w-60
    bg-gradient-to-b from-zinc-600 to-zinc-700 
    border-solid border-2 border-zinc-800 rounded-md
    text-lg font-semibold font-sans text-neutral-200' 
    style={{position: 'absolute', top: point.y, left: point.x}}
    onMouseEnter={() => { contextMenuContext.setIsHoveredOverMenu(true) }}
    onMouseLeave={() => { contextMenuContext.setIsHoveredOverMenu(false) }}>
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={handleDelete}>
        <img src='/icons/trash.svg' alt='remove' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Remove bookmark</p>
      </button>
    </div>    
  );
};
