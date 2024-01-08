import React from 'react';
import { useSelector } from 'react-redux';

import FileService from 'services/FileService.jsx';

export default function FileElement ({ file, handleContextMenuClick, clickedElement, renaming, setRenaming }) {
  const userData = useSelector(state => state.user);

  const setName = async (event) => {
    file.name = event.target.value;
    await FileService.handleRename(userData, file)
    .then(() => {
      setRenaming(false);
    })
  }

  return (
    <div className='w-10/12 h-full grid place-self-center
    border-solid border-0 border-black'
    onContextMenu={(event) => {handleContextMenuClick(event, file)}}>
      <div className='w-36 h-48 place-self-center
      bg-gradient-to-b from-neutral-300 to-neutral-400
      border-solid border-2 border-neutral-400 rounded-lg'>
      </div>

      {((renaming) && (file.uuid === clickedElement.uuid)) ? 
      <div className='w-full h-16 mt-2 grid place-self-center'>
        <textarea className='w-full place-self-center h-full text-center outline-none resize-none
        bg-transparent 
        border-solid border-0 border-neutral-200
        text-lg font-semibold font-sans text-neutral-200'
        name='name'
        defaultValue={file.name} 
        autoFocus={true}
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
