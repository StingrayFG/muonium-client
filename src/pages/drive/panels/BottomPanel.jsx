import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';


export default function BottomPanel () {
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);

  const contextMenuContext = useContext(ContextMenuContext);

  const parseSize = (size) => {
    let res = '';
    if (size > Math.pow(1024, 3)) { res += (((size / Math.pow(1024, 3)) + '').slice(0.5) + ' GiB') } 
    else if (size > Math.pow(1024, 2)) { res += (((size / Math.pow(1024, 2)) + '').slice(0,5) + ' MiB') } 
    else if (size > Math.pow(1024, 1)) { res += (((size / Math.pow(1024, 1)) + '').slice(0,5) + ' KiB') } 
    else { res += (size + ' B') } 
    return res;
  }

  const getDefaultText = () => {
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

  const getSelectionText = () => {
    let res = '';

    if (contextMenuContext.clickedElements.length > 0) {
      const folders = contextMenuContext.clickedElements.filter(element => (element.type === 'folder'));
      const files = contextMenuContext.clickedElements.filter(element => (element.type === 'file'));
      const fileSizesSum = files.reduce((partialSum, element) => partialSum + element.size, 0)

      if (folders.length > 0) {
        if (folders.length === 1) { res += '1 folder'; } 
        else { res += folders.length + ' folders'; }
      }

      if ((folders.length > 0) && (files.length > 0)) { res += ', '}

      if (files.length > 0) { 
        if (files.length === 1) { res += '1 file'; } 
        else { res += files.length + ' files'; }
        res += (' (' + parseSize(fileSizesSum) + ')');
      }

      if (clipboardData.mode === 'copy') { res += ' copied'; } 
      else if (clipboardData.mode === 'cut') { res += ' cut'; } 
      else { res += ' selected'; }
      
    } else if (contextMenuContext.hoveredElement.uuid) {
      if (contextMenuContext.hoveredElement.type === 'file') {
        res += (
          contextMenuContext.hoveredElement.name + ' (' + 
          contextMenuContext.hoveredElement.type + ', ' + 
          parseSize(contextMenuContext.hoveredElement.size) + ')'
        );
      } else if (contextMenuContext.hoveredElement.type === 'folder') {
        res += (
          contextMenuContext.hoveredElement.name + ' (' + 
          contextMenuContext.hoveredElement.type + ')'
        );
      }

    } else {
      res = getDefaultText();
    }

    return res;
  }


  return (
    <Box className='w-full px-2 py-2 grid grid-cols-[1fr_max-content] overflow-hidden
    border-sky-300/20 border-t'>

      <p className='w-full h-8
      text-left overflow-hidden break-all'>
        {getSelectionText()}
      </p>  

      <Box className='flex'>
        <Box className='separator-vertical' />
        
        <Box className='relative
        border-sky-300/20 border rounded-[0.3rem]'>
          <Box className='h-full absolute
          bg-sky-400/20 rounded-[0.2rem]'
          style={{
            width: ((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%'
          }}/>

          <p className='px-2 h-8 place-self-center text-left'>
            {((driveData.spaceTotal - driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MiB free'} 
          </p>
        </Box>
      </Box>

    </Box>
  );
}