import { useRef, useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

export default function TrashFileContextMenu ({ point }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const clipboardContext = useContext(ClipboardContext);

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const menuWidth = 240;
  const menuHeight = 4 + 40 * 3 + 2 * 0;
  
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
      onClick={clipboardContext.recoverClickedElements}>
        <img src='/icons/arrow-clockwise.svg' alt='recover' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Recover</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={clipboardContext.deleteClickedElements}>
        <img src='/icons/trash.svg' alt='delete' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Delete</p>
      </button>
    </div>    
  );
};
