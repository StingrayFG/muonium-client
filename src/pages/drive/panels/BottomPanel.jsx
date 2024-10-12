import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { FolderContext } from 'contexts/FolderContext.jsx';


export default function BottomPanel () {
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const selectionData = useSelector(state => state.selection);
  const currentFolderData = useSelector(state => state.currentFolder);

  const folderContext = useContext(FolderContext);
  
  const getContentsText = () => {
    let res = '';
    if (currentFolderData.folders.length > 0) {
      res += currentFolderData.folders.length ;
      if (currentFolderData.folders.length  > 1) {
        res += ' folders';
      } else {
        res += ' folder';
      }
    }
    if ((currentFolderData.folders.length > 0) && (currentFolderData.files.length > 0)) { 
      res += ', ';
    }
    if (currentFolderData.files.length > 0) {
      res += currentFolderData.files.length;
      if (currentFolderData.files.length > 1) {
        res += ' files';
      } else {
        res += ' file';
      }
    }
    return res;
  }

  const getClipboardText = () => {
    let res = '';

    if (selectionData.elements.length > 0) {
      if (selectionData.elements.length === 1) {
        res += '1 element';
      } else {
        res += (selectionData.elements.length + ' elements');
      }

      if (!clipboardData.mode) {
        res += ' folder';
      } else if (clipboardData.mode === 'copy') {
        res += ' copied';
      } else if (clipboardData.mode === 'cut') {
        res += ' cut';
      }
    }

  }

  return (
    <Box className='w-full px-2 py-2 flex 
    border-sky-300/20 border-t'>

      <Box className='flex'>
        <Box className='flex'>
          <p className='px-2 h-8 place-self-center text-left'>
            {getContentsText()}
          </p>
        </Box>

        {getContentsText() && <Box className='separator-vertical' />}

        <Box className='flex'>
          <p className='px-2 h-8 place-self-center text-left'>
            {getClipboardText()}
          </p>
        </Box>
      </Box>

      <Box className='ml-auto flex'>
        <Box className='separator-vertical' />
        
        <Box className='relative 
        border-sky-300/20 border rounded-[0.3rem]'>
          <Box className='h-full absolute
          bg-sky-400/20 rounded-[0.2rem]'
          style={{
            width: ((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%'
          }}/>

          <p className='px-4 h-8 place-self-center text-left'>
            {((driveData.spaceTotal - driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MB free'} 
          </p>
        </Box>
      </Box>

    </Box>
  );
}