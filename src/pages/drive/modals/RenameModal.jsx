import React, { useState, useContext } from 'react';
import { Box } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';


export default function RenameModal ({ name, setName, stopNaming, usedNames }) {
  const [nameInputValue, setNameInputValue] = useState(name);

  const handleOnKeyDown = (event) => {
    if (event.code === 'Enter') { 
      event.preventDefault();
      setName();
    } else if (event.code === 'Escape') { 
      stopNaming();
    }
  }

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
  }


  return(
    <Box className='w-full max-w-[360px] px-4 place-self-center'
    onKeyDown={handleOnKeyDown}>
      <p className='font-semibold'>
        {'Enter the new name'}
      </p>
      
      <TextareaAutosize className={`w-full mt-4 py-1 px-2
      bg-transparent border border-sky-300/20 rounded-[0.3rem]
      leading-6 text-center`}
      name='name'
      autoFocus
      minRows={1}
      spellCheck={false}
      value={nameInputValue}
      onChange={handleOnNameChange}
      onFocus={handleOnNameFocus}/>

      <Box className='mt-1 grid grid-cols-2 gap-2'>
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

      <p className={`mt-4
      transition-all duration-300
      text-center text-rose-500
      ${(usedNames.includes(nameInputValue) && (nameInputValue !== name)) ? 'opacity-100' : 'opacity-0'}`}>
        {'Name is already used'}
      </p>
    </Box>
  )
};