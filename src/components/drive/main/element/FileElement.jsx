import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import FileService from 'services/FileService.jsx';

export default function FileElement ({ file }) {
  const contextMenuContext = useContext(ContextMenuContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(file.name);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const setName = async (event) => {
    if (event.target.value) {
      await FileService.handleRename(userData, { uuid: file.uuid, name: event.target.value })
      .then(() => {
        contextMenuContext.setRenaming(false);
        dispatch(requestUpdate());
      })
    } else {
      setInputData(previousName);
      contextMenuContext.setRenaming(false);
    }
  }

  return (
    <div className={`w-full h-full grid place-self-center
    border-solid border-0 border-black rounded-md
    ${(file.uuid === contextMenuContext.clickedElement.uuid) ?
    'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
    :
    'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
    onMouseDown={(event) => { contextMenuContext.enableDragging(event, file) }}
    onMouseEnter={() => { contextMenuContext.setHoveredElement(file) }}
    onMouseLeave={() => { contextMenuContext.setHoveredElement({ uuid: '' })}}
    onContextMenu={(event) => { contextMenuContext.handleFileContextMenuClick(event, file) }}>

      <div className={`w-64 h-48 mt-4 place-self-center grid
      border-solid border-0 border-black rounded-lg
      ${(clipboardData.cutElementsUuids.includes(file.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
        <img src='/icons/mu-file.svg' alt='prev' width='220' className='place-self-center pointer-events-none select-none'/>
      </div>

      {((contextMenuContext.renaming) && (file.uuid === contextMenuContext.clickedElement.uuid)) ? 
      <div className='w-full h-24 mt-2 grid place-self-center'>
        <textarea className='w-full place-self-center h-full text-center outline-none resize-none
        bg-transparent 
        border-solid border-2 border-neutral-200 rounded-md
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
      <div className='w-full h-24 mt-2 grid place-self-center'>
        <p className='w-full place-self-center h-full text-center select-none
        border-solid border-2 border-transparent
        text-lg font-semibold font-sans text-neutral-200'>
          {file.name}   
        </p>
      </div>
      }
    </div>
  );
}
