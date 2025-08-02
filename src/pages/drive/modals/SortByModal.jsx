import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setSidePanelIsEnabled, setSidePanelIsOverlayMode } from 'state/slices/settingsSlice';

import { ModalContext } from 'contexts/ModalContext';

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

  const changeSidePanelIsOverlayMode = (value) => {
    dispatch(setSidePanelIsOverlayMode(value))
  }


  return(
    <Box className='max-w-full w-[360px] px-4'
    onKeyDown={handleOnKeyDown}>
      <p className='mb-4 leading-6 font-semibold text-center'>
        {'Settings'}
      </p>
      
      <Box className='h-8 flex mb-6'>
        <CustomCheckbox 
        value={settingsData.sidePanelIsEnabled}
        setValue={changeSidePanelIsEnabled}
        />
        <p className='ml-2'>{'Show side panel'}</p>
      </Box>
      
      <Box className='flex mb-6'>
        <CustomCheckbox 
        value={settingsData.sidePanelIsOverlayMode}
        setValue={changeSidePanelIsOverlayMode}
        />
        <p className='ml-2'>{'Show side panel on top of folder contents'}</p>
      </Box>

      <Box className='mt-4 grid'>
        <Box className={`h-8 px-2`}
        onClick={handleConfirm}>
          <p className={`transition-all duration-300`}>
            {'Confirm'}
          </p>   
        </Box>
      </Box>

      <Box className='h-12 w-12 fixed top-0 right-0 grid place-content-center
      hover:opacity-50 hover:bg-transparent bg-transparent'
      onClick={handleClose}>
        <Box className='h-8 w-8 m-2 grid
        rounded-full bg-black/40'>
          <XLg className='w-5 h-5 place-self-center'/>
        </Box>      
      </Box>

    </Box>
  )
};