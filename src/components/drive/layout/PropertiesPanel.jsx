import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FileIconElement from 'components/drive/element/FileIconElement.jsx';

export default function PropertiesPanel () {
  const selectionData = useSelector(state => state.selection);

  const [creationDate, setCreationDate] = useState();
  const [modificationDate, setModificationDate] = useState();

  useEffect(() => {
    if (selectionData.elements.length === 1) {
      setCreationDate(new Date(selectionData.elements[0].creationDate).toString().slice(0, 24));
      setModificationDate(new Date(selectionData.elements[0].modificationDate).toString().slice(0, 24));
    }
  })

  return (
    <div className='w-96 h-full ml-auto
    border-solid border-l-2 border-zinc-800
    text-2xl font-semibold font-sans text-neutral-200'>

      {(selectionData.elements.length === 1) && <>       
        <div className='w-full h-12 px-3 flex text-left text-zinc-400'>
          <p className='place-self-center'>Properties</p>
        </div>
  
        <div className='w-full h-12 px-3 grid text-left'>
          <div className='mt-2 ml-1 grid grid-cols-[max-content_1fr]'>
            <div className='w-10 h-10'>
              {(selectionData.elements[0].type === 'file') && <FileIconElement file={selectionData.elements[0]} type={'list'}/>}
              {(selectionData.elements[0].type === 'folder') && <img src='/icons/folder2.svg' alt='icon' width='40' className='place-self-center pointer-events-none select-none'/>}
            </div>

            <p className='w-full place-self-start ml-3'>{selectionData.elements[0].name}</p>
          </div>

          <div className='text-lg mt-6'>
            <div className='flex'>
              <p className='w-24'>Created:</p>
              <p>{creationDate}</p>
            </div>

            <div className='flex mt-2'>
              <p className='w-24'>Modified:</p>
              <p>{modificationDate}</p>
            </div>
          </div>
        </div>  
      </>}  
    </div>
  );
}