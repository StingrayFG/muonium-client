import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moveToNew, requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FolderService from 'services/FolderService.jsx';
import FileService from 'services/FileService.jsx';

export default function FolderElement ({ folder }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);

  if (!folder) { folder = { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } }

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(folder.name);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const setName = async (event) => {
    console.log(inputData)
    if (inputData) {
      folder.name = event.target.value;
      if (contextMenuContext.creatingFolder) {
        await FolderService.handleCreate(userData, folder, folderContext.currentFolder.absolutePath)
        .then(() => {
          contextMenuContext.setCreatingFolder(false);
          dispatch(requestUpdate());
        })
      } else {
        await FolderService.handleRename(userData, folder)
        .then(() => {
          contextMenuContext.setRenaming(false);
          dispatch(requestUpdate());
        })
      }
    } else {
      setInputData(previousName);
      contextMenuContext.setCreatingFolder(false);
      contextMenuContext.setRenaming(false);
    }
  }

  const handleKeyOnInput = (event) => {
    if (event.code === 'Enter') { event.target.blur(); }
    else if (event.code === 'Escape') { 
      setInputData('');
      contextMenuContext.setCreatingFolder(false);
      contextMenuContext.setRenaming(false);
      event.target.blur();
    }
  }

  const handleDoubleClick = () => {
    if (!folder.isRemoved) {
      dispatch(moveToNew({ uuid: folder.uuid }));
    }
  }

  useEffect(() => {
    const moveElement = async () => {
      if (contextMenuContext.requiresMove) {
        contextMenuContext.setRequiresMove(false);
        if (contextMenuContext.clickedElement.type === 'file') {
          await FileService.handleMove(userData, contextMenuContext.hoveredElement.uuid, contextMenuContext.clickedElement)
          .then(() => {
            dispatch(requestUpdate());
          })
        } else if (contextMenuContext.clickedElement.type === 'folder') {
          FolderService.handleMove(userData, contextMenuContext.hoveredElement.uuid, contextMenuContext.clickedElement)
          .then(() => {
            dispatch(requestUpdate());
          })
        }
      }
    }
    moveElement();
  })

  return (
    <div className={`w-full h-full grid place-self-center
    border-solid border-0 border-black rounded-md
    ${((folder.uuid === contextMenuContext.clickedElement.uuid) ||
    ((contextMenuContext.renaming) && (folder.uuid === contextMenuContext.clickedElement.uuid)) || 
    ((contextMenuContext.creatingFolder) && (!folder.uuid))) ?
    'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
    :
    'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
    onMouseDown={(event) => { contextMenuContext.enableDragging(event, folder) }}
    onMouseEnter={() => { contextMenuContext.setHoveredElement(folder) }}
    onMouseLeave={() => { contextMenuContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleFolderContextMenuClick(event, folder) }}
    onDoubleClick={handleDoubleClick}>

      <div className={`w-48 h-48 mt-4 place-self-center  relative
      border-solid border-0 border-black rounded-lg
      ${(clipboardData.cutElementsUuids.includes(folder.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
        <div className='w-36 h-16 right-0 absolute
        bg-gradient-to-b from-zinc-400 to-zinc-500
        border-solid border-2 border-zinc-500 rounded-md'>
        </div>
        <div className='w-48 h-36 bottom-0 absolute
        bg-gradient-to-b from-neutral-300 to-neutral-400
        border-solid border-2 border-neutral-400 rounded-md'>
        </div> 
      </div>

      {(((contextMenuContext.renaming) && (folder.uuid === contextMenuContext.clickedElement.uuid)) || 
      ((contextMenuContext.creatingFolder) && (!folder.uuid))) ? 
      <div className='w-full h-24 mt-2 grid place-self-center'>
        <textarea className='w-full h-full place-self-center text-center outline-none resize-none
        bg-transparent 
        border-solid border-2 border-neutral-200 rounded-md
        text-lg font-semibold font-sans text-neutral-200'
        name='name'
        value={inputData}
        onChange={e => setInputData(e.target.value)}
        autoFocus={true}
        onFocus={savePreviousName}
        onBlur={setName}
        onKeyDown={handleKeyOnInput}>
        </textarea> 
      </div>
      : 
      <div className='w-full h-24 mt-2 grid place-self-center'>
        <p className='w-full place-self-center h-full text-center select-none
        border-solid border-0 border-neutral-200
        text-lg font-semibold font-sans text-neutral-200'>
          {folder.name}   
        </p>
      </div>
      }
    </div>
  );
}
