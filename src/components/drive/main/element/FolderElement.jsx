import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moveToNew, requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';


import FolderService from 'services/FolderService.jsx';

export default function FolderElement ({ folder }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  if (!folder) { folder = { uuid: '', name: '', parentUuid: folderContext.currentFolder.uuid } }

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(folder.name);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const setName = async (event) => {
    if (event.target.value) {
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

  const handleDoubleClick = () => {
    if(!folder.isRemoved) {
      dispatch(moveToNew({ uuid: folder.uuid }));
    }
  }

  return (
    <div className='w-10/12 h-full grid place-self-center
    border-solid border-0 border-black'>
      <div className='w-48 h-48 place-self-center  relative
      border-solid border-0 border-black rounded-lg' 
      onContextMenu={(event) => {contextMenuContext.handleFolderContextMenuClick(event, folder)}}
      onDoubleClick={handleDoubleClick}>
        <div className='w-36 h-16 right-0 absolute
        bg-gradient-to-b from-zinc-600 to-zinc-700
        border-solid border-2 border-zinc-700 rounded-lg'>
        </div>
        <div className='w-48 h-36 bottom-0 absolute
        bg-gradient-to-b from-neutral-300 to-neutral-400
        border-solid border-2 border-neutral-400 rounded-lg'>
        </div> 
      </div>

      {(((contextMenuContext.renaming) && (folder.uuid === contextMenuContext.clickedElement.uuid)) || 
      ((contextMenuContext.creatingFolder) && (!folder.uuid))) ? 
      <div className='w-full h-16 mt-2 grid place-self-center'>
        <textarea className='w-full h-full place-self-center text-center outline-none resize-none
        bg-transparent 
        border-solid border-2 border-neutral-200 rounded-lg
        text-lg font-semibold font-sans text-neutral-200'
        name='name'
        value={inputData}
        onChange={e => setInputData(e.target.value)}
        autoFocus={true}
        onFocus={savePreviousName}
        onBlur={setName}
        onKeyDown={(event) => { if (event.code === 'Enter') { event.target.blur(); } }}>
        </textarea> 
      </div>
      : 
      <div className='w-full h-16 mt-2 grid place-self-center'>
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
