import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { requestUpdate } from 'services/slice/PathSlice';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';

import FileService from 'services/FileService.jsx';

import FileIconElement from 'components/drive/main/element/FileIconElement.jsx';

export default function FileElement ({ file }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  const [previousName, setPreviousName] = useState('');
  const [inputData, setInputData] = useState(file.name);

  const savePreviousName = (event) => {
    setPreviousName(event.target.value);
  }

  const setName = async (event) => {
    if (event.target.value) {
      file.name = event.target.value
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

  if (settingsData.type === 'grid') {
    return (
      <div className={`w-full h-full px-2 pb-2 grid place-self-center
      border-solid border-0 border-black rounded-md
      ${(cutCopyPasteContext.clickedElements.includes(file)) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
      onMouseDown={(event) => { cutCopyPasteContext.handleMouseEnter(event, file) }}
      onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(file) }}
      onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
      onContextMenu={(event) => { contextMenuContext.handleFileContextMenuClick(event, file) }}>
  
        <div className={`w-full h-48 -mb-3 place-self-center grid
        border-solid border-0 border-black rounded-lg
        ${(clipboardData.cutElementsUuids.includes(file.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
          <img src='/icons/mu-file.svg' alt='file' width='200' className='place-self-center pointer-events-none select-none' /> 
          <FileIconElement file={file} type={settingsData.type}/>
        </div>
  
        {((contextMenuContext.renaming) && (cutCopyPasteContext.clickedElements.includes(file))) ? 
        <div className='w-full h-24 grid place-self-center'>
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
        <div className='w-full h-24 grid place-self-center'>
          <p className='w-full h-full place-self-center text-center select-none
          border-solid border-2 border-transparent
          text-lg font-semibold font-sans text-neutral-200'>
            {file.name}   
          </p>
        </div>
        }
      </div>
    );
  } else if (settingsData.type === 'list') {
    return (
      <div className={`w-full h-16 pr-4 flex place-self-center
      border-solid border-0 border-black rounded-md
      ${(cutCopyPasteContext.clickedElements.includes(file)) ?
      'bg-gradient-to-b from-sky-200/30 to-sky-400/30'
      :
      'hover:bg-gradient-to-b hover:from-sky-200/15 hover:to-sky-400/15'}`}
      onMouseDown={(event) => { cutCopyPasteContext.handleMouseEnter(event, file) }}
      onMouseEnter={() => { cutCopyPasteContext.setHoveredElement(file) }}
      onMouseLeave={() => { cutCopyPasteContext.setHoveredElement({ uuid: '' })}}
      onContextMenu={(event) => { contextMenuContext.handleFileContextMenuClick(event, file) }}>
  
        <div className={`w-16 h-16 place-self-center grid
        border-solid border-0 border-black rounded-lg
        ${(clipboardData.cutElementsUuids.includes(file.uuid)) ? 'opacity-50' : 'opacity-100'}`}>
          <FileIconElement file={file} type={settingsData.type}/>
        </div>
  
        {((contextMenuContext.renaming) && (cutCopyPasteContext.clickedElements.includes(file))) ? 
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
          onKeyDown={(event) => { if (event.code === 'Enter') { event.target.blur(); } }}>
          </textarea> 
        </div>
        : 
        <div className='w-full h-16 grid'>
          <p className='w-full h-8 px-2 place-self-center text-left select-none
          border-solid border-2 border-transparent
          text-lg font-semibold font-sans text-neutral-200'>
            {file.name}   
          </p>
        </div>
        }
      </div>
    );
  }
}
