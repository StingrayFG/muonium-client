import React, { useState, useContext } from 'react';
import { Box } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';

import { ModalContext } from 'contexts/ModalContext';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'


export default function RenameModal ({ name, setName, stopNaming, usedNames }) {
  const modalContext = useContext(ModalContext);

  const [nameInputValue, setNameInputValue] = useState(name);

  const handleOnNameChange = (event) => {
    setNameInputValue(event.target.value)
  }

  const handleOnNameFocus = (event) => {
    event.currentTarget.setSelectionRange(
      0,
      event.currentTarget.value.replace(/\.[^/.]+$/, "").length
    )
  }

  const handleConfirm = () => {
    if (nameInputValue.length > 0) {
      setName(nameInputValue);
    }  
  }

  const handleCancel = () => {
    stopNaming();
    handleClose();
  }

  const handleClose = () => {
    modalContext.closeNextModal();
  }

  const handleOnKeyDown = (event) => {
    if (event.code === 'Enter') { 
      event.preventDefault();
      handleConfirm();
    } else if (event.code === 'Escape') { 
      handleCancel();
    }
  }


  return(
    <Box className='max-w-full w-[360px] px-4'
    onKeyDown={handleOnKeyDown}>
      <p className='mb-4 leading-6 font-semibold text-center'>
        {'Enter the new name'}
      </p>
      
      <TextareaAutosize className={`w-full py-1 px-2
      bg-transparent border border-sky-300/20 rounded-[0.3rem]
      leading-6 text-center`}
      name='name'
      autoFocus
      minRows={1}
      spellCheck={false}
      value={nameInputValue}
      onChange={handleOnNameChange}
      onFocus={handleOnNameFocus}/>

      <Box className='mt-4 grid grid-cols-2 gap-2'>
        <button className='h-8 px-2'
        onClick={handleCancel}>
          <p>
            {'Cancel'}
          </p>
        </button>

        <button className={`h-8 px-2
        ${(nameInputValue.length > 0) ? '' : 'button-inactive' } `}
        onClick={handleConfirm}>
          <p className={`transition-all duration-300
          ${(nameInputValue.length > 0) ? 'opacity-100' : 'opacity-40' }`}>
            {'Confirm'}
          </p>   
        </button>
      </Box>

      <p className={`
      transition-all duration-300
      text-center text-rose-500
      ${(usedNames.includes(nameInputValue) && (nameInputValue !== name)) ? 'opacity-100' : 'opacity-0'}`}>
        {'Name is already used'}
      </p>

      <button className='h-12 w-12 fixed top-0 right-0 grid place-content-center
      hover:opacity-50 hover:bg-transparent bg-transparent'
      onClick={handleClose}>
        <Box className='h-8 w-8 m-2 grid
        rounded-full bg-black/40'>
          <XLg className='w-5 h-5 place-self-center'/>
        </Box>      
      </button>

    </Box>
  )
};