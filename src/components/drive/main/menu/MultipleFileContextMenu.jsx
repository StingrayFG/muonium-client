import { useRef, useContext } from 'react';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

export default function MultipleFileContextMenu ({ point }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const menuWidth = 240;
  const menuHeight = 4 + 40 * 4 + 2 * 2;
  
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
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={cutCopyPasteContext.downloadClickedElements}>
        <img src='/icons/download.svg' alt='download' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Download</p>
      </button>

      <div className='mx-1 border-solid border-t-2 border-zinc-800 border-top'></div>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={cutCopyPasteContext.copyClickedElements}>
        <img src='/icons/clipboard-plus.svg' alt='copy' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Copy</p>
      </button>

      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={cutCopyPasteContext.cutClickedElements}>
        <img src='/icons/clipboard-x.svg' alt='cut' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Cut</p>
      </button>

      <div className='mx-1 border-solid border-t-2 border-zinc-800 border-top'></div>
      
      <button className='w-full h-10 px-2 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={cutCopyPasteContext.removeClickedElements}>
        <img src='/icons/trash.svg' alt='trash' width='20' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Move to trash</p>
      </button>
    </div>    
  );
};
