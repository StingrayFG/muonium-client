import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { moveToNew } from 'state/slices/PathSlice';

import { CutCopyPasteContext } from 'contexts/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();

  if (!bookmark) { bookmark = { uuid: '', folder: { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } } };

  const handleClick = (event) => {
    if (event.button === 0) {   
      cutCopyPasteContext.clearClickedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }

  return (
    <button className={`w-full h-12 px-3 flex text-left'
    ${(cutCopyPasteContext.clickedElements.includes(bookmark)) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30 rounded'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15 rounded'}`}
    onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(bookmark) }}
    onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleBookmarkContextMenuClick(event, bookmark) }}
    onMouseDown={handleClick}>
      <p className='ml-9 place-self-center'>{ bookmark.folder.name + (bookmark.folder.isRemoved ? ' (in trash)' : '') }</p>
    </button>
  );
}
