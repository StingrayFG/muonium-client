import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import FileService from 'services/FileService.jsx';

export default function FileElement ({ file }) {
  const contextMenuContext = useContext(ContextMenuContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(file.name);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const setName = async (event) => {
    if (event.target.value) {
      file.name = event.target.value;
      await FileService.handleRename(userData, file)
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
    <div className='w-10/12 h-full grid place-self-center
    border-solid border-0 border-black'
    onContextMenu={(event) => {contextMenuContext.handleFileContextMenuClick(event, file)}}>
      <div className='w-36 h-48 place-self-center
      bg-gradient-to-b from-neutral-300 to-neutral-400
      border-solid border-2 border-neutral-400 rounded-lg'>
      </div>

      {((contextMenuContext.renaming) && (file.uuid === contextMenuContext.clickedElement.uuid)) ? 
      <div className='w-full h-16 mt-2 grid place-self-center'>
        <textarea className='w-full place-self-center h-full text-center outline-none resize-none
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
          {file.name}   
        </p>
      </div>
      }
    </div>
  );
}
