import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import commonUtils from 'utils/commonUtils';

import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';

export default function DiskSettingsModal ({ }) {
  const driveData = useSelector(state => state.drive);

  const modalContext = useContext(ModalContext);

  const handleConfirm = () => {
    modalContext.closeNextModal();
  }

  return(
    <CommonModal 
    header={'Drive'}
    contents={<Box>

      <Box className=''>
        <p>
          {`Drive: ${commonUtils.parseFileSizeToString(driveData.spaceTotal)}`}
        </p>
      </Box>

      <Box className='mt-2'>
        <p>
          {`Free space: ${commonUtils.parseFileSizeToString(driveData.spaceTotal - driveData.spaceUsed)}
          (${Math.round((1 - (driveData.spaceUsed / driveData.spaceTotal)) * 100)}%)`}
        </p>
      </Box>

      <Box className='mt-2'>
        <p>
          {`Space used: ${commonUtils.parseFileSizeToString( driveData.spaceUsed)}
          (${Math.round((driveData.spaceUsed / driveData.spaceTotal) * 100)}%)`}
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