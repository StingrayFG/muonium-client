import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setSidePanelIsEnabled } from 'state/slices/settingsSlice';

import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';
import CustomCheckbox from 'components/checkbox/CustomCheckbox';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'


export default function SettingsModal ({ }) {
  const dispatch = useDispatch();

  const settingsData = useSelector(state => state.settings);
  
  const modalContext = useContext(ModalContext);

  const handleConfirm = () => {
    handleClose();
  }

  const handleOnKeyDown = (event) => {
    console.log(event)  
    if (event.code === 'Escape') { 
      handleClose();
    }
  }

  const handleClose = () => {
    modalContext.closeNextModal();
  }

  const changeSidePanelIsEnabled = (value) => {
    dispatch(setSidePanelIsEnabled(value))
  }


  // FOCUS
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  return(
    <CommonModal 
    header={'Settings'}
    contents={<Box className='flex flex-col'>

      <Box className='flex'>
        <CustomCheckbox 
        value={settingsData.sidePanelIsEnabled}
        setValue={changeSidePanelIsEnabled}
        />
        <p className='ml-2 py-1'>{'Show side panel'}</p>
      </Box>

      <Box className='mt-2 grid grid-flow-col gap-2 shrink-0'>
        <Box className='button-common min-w-full'
        onClick={handleClose}>
          <p className='button-common-text'>
            {'Confirm'}
          </p>
        </Box>
      </Box>
      
    </Box>}/>
  )
};