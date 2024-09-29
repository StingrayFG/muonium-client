import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/PathSlice';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

import { ReactComponent as House } from 'assets/icons/house.svg'
import { ReactComponent as Trash } from 'assets/icons/trash.svg'


export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const clipboardContext = useContext(ClipboardContext);
  const folderContext = useContext(FolderContext);

  const pathData = useSelector(state => state.path);
  
  const dispatch = useDispatch();

  if (!bookmark) { bookmark = { uuid: '', folder: { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } } };

  const handleClick = (event) => {
    if (event.button === 0) {   
      clipboardContext.clearClickedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }

  const getIcon = () => {
    if (bookmark.folder.uuid === 'home') {
      return <House className='h-5 w-5 mt-[7px]'/>
    } else if (bookmark.folder.uuid === 'trash') {
      return <Trash className='h-5 w-5 mt-[7px]'/>
    } else {
      return <Box className='h-5 w-5 mt-[7px]'/>
    }
  }

  return (
    <button className={`w-full h-8 px-2 flex text-left
    border-none rounded-none
    ${(clipboardContext.clickedElements.includes(bookmark)) ? 
    'bg-sky-400/40 hover:bg-sky-400/40 active:bg-sky-400/40 duration-0' 
    : 
    `${((bookmark.folder.uuid === pathData.currentUuid) && (clipboardContext.clickedElements.length === 0)) ? 
      'bg-sky-400/20 hover:bg-sky-400/30 active:bg-sky-400/40' : 'hover:bg-sky-400/10 active:bg-sky-400/40'}`
    }`}
    onMouseEnter={() => { clipboardContext.setHoveredElement(bookmark) }}
    onMouseLeave={() => { clipboardContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleBookmarkContextMenuClick(event, bookmark) }}
    onMouseDown={handleClick}>
      {getIcon()}
      <p className='ml-2 place-self-center'>{ bookmark.folder.name + (bookmark.folder.isRemoved ? ' (in trash)' : '') }</p>
    </button>
  );
}
