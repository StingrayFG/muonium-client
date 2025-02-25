import React, { useState, useContext } from 'react';
import { Box } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';

import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';

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

  return(
    <CommonModal 
    header={'Rename'}
    customCloseFunction={handleCancel}
    contents={<Box className='flex flex-col'>

      <TextareaAutosize className='w-full shrink-0'
      name='name'
      autoFocus
      minRows={1}
      spellCheck={false}
      value={nameInputValue}
      onChange={handleOnNameChange}
      onFocus={handleOnNameFocus}/>

      <Box className='mt-2 grid grid-flow-col gap-2 shrink-0'>
        <Box className='button-common min-w-full'
        onClick={handleCancel}>
          <p className='button-common-text'>
            {'Cancel'}
          </p>
        </Box>

        <Box className={`button-common min-w-full
        ${((nameInputValue.length === 0) || (usedNames.includes(nameInputValue) && (nameInputValue !== name))) ? 
        'button-common-inactive' : '' } `}
        onClick={handleConfirm}>
          <p className={`button-common-text
          transition-all duration-300
          ${(nameInputValue.length > 0) ? 'opacity-100' : 'opacity-40' }`}>
            {'Confirm'}
          </p>   
        </Box>
      </Box>

      <p className={`mt-2 shrink-0
      transition-all duration-300
      text-center text-rose-500
      ${(usedNames.includes(nameInputValue) && (nameInputValue !== name)) ? 'opacity-100' : 'opacity-0'}`}>
        {'Name is already used'}
      </p>
      
    </Box>}/>
  )
};