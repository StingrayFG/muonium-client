import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Slider } from '@mui/material';

import { setSidePanelIsEnabled, setGridElementWidth, setListElementHeight } from 'state/slices/settingsSlice';
import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';

import config from 'config.json';


export default function DiskSettingsModal ({ }) {
  const dispatch = useDispatch();

  const driveData = useSelector(state => state.drive);
  const currentFolderData = useSelector(state => state.currentFolder);
  const settingsData = useSelector(state => state.settings);

  const modalContext = useContext(ModalContext);


  // HANDLERS
  const handleConfirm = () => {
    modalContext.closeNextModal();
  }



  return(
    <CommonModal 
    header={'Drive'}
    contents={<Box>

      <Box className=''>
        <p>
          {'Drive: ' + (driveData.spaceTotal / (1024 * 1024)).toFixed(0) + ' MiB'}
        </p>
      </Box>

      <Box className='mt-2'>
        <p>
          {'Free space: ' + ((driveData.spaceTotal - driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MiB'}
        </p>
      </Box>

      <Box className='mt-2'>
        <p>
          {'Space used: ' + Math.round((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%' +
          ' (' + ((driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MiB)'}
        </p>
      </Box>

      <Box className='mt-2 grid grid-flow-col gap-2'>
        <Box className='button-common min-w-full'
        onClick={handleConfirm}>
          <p className='button-common-text'>
            {'Confirm'}
          </p>   
        </Box>
      </Box>

    </Box>}/>
  )
};