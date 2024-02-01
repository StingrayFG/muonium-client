import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moveToNew, requestUpdate } from 'services/slice/PathSlice';

import { CutCopyPasteContext } from 'components/drive/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/context/FolderContext.jsx';

import FolderService from 'services/FolderService.jsx';

export default function FolderElement ({ folder }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  if (!folder) { folder = { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } }

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(folder.name);
  const [requiresNameSaving, setRequiresNameSaving] = useState(false);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const handleKeyOnInput = (event) => {
    if (event.code === 'Enter') { event.target.blur(); }
    else if (event.code === 'Escape') { 
      setInputData(previousName);
      event.target.blur();
    }
  }

  const setName = async () => {
    setRequiresNameSaving(true); 
  }

  useEffect(() => {
    if (requiresNameSaving) {
      setRequiresNameSaving(false);

      const saveName = async () => {
        if (inputData) {

          if (contextMenuContext.isCreatingFolder) {
            await FolderService.handleCreate(userData, { uuid: folder.uuid, name: inputData }, folderContext.currentFolder.uuid)
            .then(() => {
              contextMenuContext.setIsCreatingFolder(false);
              dispatch(requestUpdate());
            })
            .catch(() => {
              setInputData(previousName);
              contextMenuContext.setIsRenaming(false);
            })
          } else {
            await FolderService.handleRename(userData, { uuid: folder.uuid, name: inputData })
            .then(() => {
              contextMenuContext.setIsRenaming(false);
              dispatch(requestUpdate());
            })
            .catch(() => {
              setInputData(previousName);
              contextMenuContext.setIsRenaming(false);
            })
          }
        } else {
          setInputData(previousName);
          contextMenuContext.setIsCreatingFolder(false);
          contextMenuContext.setIsRenaming(false);
        }
      }
      saveName();
    }
  })

  const handleDoubleClick = () => {
    if (!folder.isRemoved) {
      dispatch(moveToNew({ uuid: folder.uuid }));
    }
  }
  
  
  if (settingsData.type === 'grid') {
    return (
      <div className={`w-full h-full px-2 pb-2 grid place-self-center
      border-solid border-0 border-black rounded-md
      ${((cutCopyPasteContext.clickedElements.includes(folder)) ||
      ((contextMenuContext.isRenaming) && (cutCopyPasteContext.clickedElements.includes(folder))) || 
      ((contextMenuContext.isCreatingFolder) && (!folder.uuid))) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
      onMouseDown={(event) => { cutCopyPasteContext.handleMouseDown(event, folder) }}
      onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(folder) }}
      onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
      onContextMenu={(event) => { contextMenuContext.handleFolderContextMenuClick(event, folder) }}
      onDoubleClick={handleDoubleClick}>
  
        <div className={`w-full h-48 -mb-3 place-self-center grid
        border-solid border-0 border-black rounded-lg
        ${(clipboardData.cutElementsUuids.includes(folder.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
          <img src='/icons/mu-folder.svg' alt='folder' width='200' className='place-self-center pointer-events-none select-none'/>
        </div>
  
        {(((contextMenuContext.isRenaming) && (cutCopyPasteContext.clickedElements.includes(folder))) || 
        ((contextMenuContext.isCreatingFolder) && (!folder.uuid))) ? 
        <div className='w-full h-24 grid place-self-center'>
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
        <div className='w-full h-24 grid place-self-center'>
          <p className='w-full h-full place-self-center text-center select-none
          border-solid border-2 border-transparent
          text-lg font-semibold font-sans text-neutral-200'>
            {inputData}   
          </p>
        </div>
        }
      </div>
    );
  } else if (settingsData.type === 'list') {
    return (
      <div className={`w-full h-16 pr-4 flex place-self-center
      border-solid border-0 border-black rounded-md
      ${((cutCopyPasteContext.clickedElements.includes(folder)) ||
      ((contextMenuContext.isRenaming) && (cutCopyPasteContext.clickedElements.includes(folder))) || 
      ((contextMenuContext.isCreatingFolder) && (!folder.uuid))) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
      onMouseDown={(event) => { cutCopyPasteContext.handleMouseDown(event, folder) }}
      onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(folder) }}
      onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
      onContextMenu={(event) => { contextMenuContext.handleFolderContextMenuClick(event, folder) }}
      onDoubleClick={handleDoubleClick}>
  
        <div className={`w-16 h-16 place-self-center grid
        border-solid border-0 border-black rounded-lg
        ${(clipboardData.cutElementsUuids.includes(folder.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
          <img src='/icons/folder2.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>
        </div>
  
        {(((contextMenuContext.isRenaming) && (cutCopyPasteContext.clickedElements.includes(folder))) || 
        (contextMenuContext.isCreatingFolder)) ? 
        <div className='w-full h-16 grid place-self-center'>
          <textarea className='w-full h-8 px-2 place-self-center text-left select-none outline-none resize-none
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
        <div className='w-full h-16 grid place-self-center'>
          <p className='w-full h-8 px-2 place-self-center text-left select-none
          border-solid border-2 border-transparent
          text-lg font-semibold font-sans text-neutral-200'>
            {inputData}   
          </p>
        </div>
        }
      </div>
    );
  }
    
}
