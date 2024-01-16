import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { moveToNew } from 'services/slice/PathSlice';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();

  if (!bookmark) { bookmark = { uuid: '', folder: { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } } };

  const handleClick = () => {
    if (!bookmark.folder.isRemoved) {   
      dispatch(moveToNew({ uuid: bookmark.folder.uuid }));
    }
  }

  return (
    <button className={`w-full h-12 px-3 flex text-left'
    ${(bookmark.uuid === cutCopyPasteContext.clickedElement.uuid) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30 rounded'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15 rounded'}`}
    onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(bookmark) }}
    onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleBookmarkContextMenuClick(event, bookmark) }}
    onClick={handleClick}>
      <p className='ml-9 place-self-center'>{bookmark.folder.name}</p>
    </button>
  );
}
