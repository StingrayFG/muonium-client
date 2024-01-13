import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moveToNew, requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FolderService from 'services/FolderService.jsx';
import FileService from 'services/FileService.jsx';

export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  if (!bookmark) { bookmark = { uuid: '', folder: { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } } };

  const handleClick = () => {
    if (!bookmark.folder.isRemoved) {   
      dispatch(moveToNew({ uuid: bookmark.folder.uuid }));
    }
  }

  useEffect(() => {
    const moveElement = async () => {
      if (contextMenuContext.requiresMove) {
        contextMenuContext.setRequiresMove(false);
        if (contextMenuContext.clickedElement.type === 'file') {
          await FileService.handleMove(userData, bookmark.folder.uuid, contextMenuContext.clickedElement)
          .then(() => {
            dispatch(requestUpdate());
          })
        } else if (contextMenuContext.clickedElement.type === 'folder') {
          FolderService.handleMove(userData, bookmark.folder.uuid, contextMenuContext.clickedElement)
          .then(() => {
            dispatch(requestUpdate());
          })
        }
      }
    }
    moveElement();
  })

  return (
    <button className={`w-full h-12 px-3 flex text-left'
    ${(bookmark.uuid === contextMenuContext.clickedElement.uuid) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30 rounded'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15 rounded'}`}
    onMouseEnter={() => { contextMenuContext.setHoveredElement(bookmark) }}
    onMouseLeave={() => { contextMenuContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleBookmarkContextMenuClick(event, bookmark) }}
    onClick={handleClick}>
      <p className='ml-9 place-self-center'>{bookmark.folder.name}</p>
    </button>
  );
}
