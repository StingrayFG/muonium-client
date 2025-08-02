import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { UseDefinedValueMemo } from 'hooks/UseDefinedValueMemo';

import { clearClipboard } from 'state/slices/clipboardSlice.jsx';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as Scissors } from 'assets/icons/scissors.svg';
import { ReactComponent as Files } from 'assets/icons/files.svg';
import { ReactComponent as XLg } from 'assets/icons/x-lg.svg';
import { ReactComponent as Trash } from 'assets/icons/trash.svg';
import { ReactComponent as ClipboardMinus } from 'assets/icons/clipboard2-minus.svg';
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg';
import { ReactComponent as FileEmptyBs } from 'assets/icons/elements/bootstrap/file-earmark.svg';


export default function SelectionPanel () {
  const dispatch = useDispatch();

  const clipboardData = useSelector(state => state.clipboard);

  const contextMenuContext = useContext(ContextMenuContext);


  // ANIMATED VALUES
  const [usedClipboardMode] = UseDefinedValueMemo([clipboardData.mode]);

  const [
    selectedFolderCount, 
    selectedFileCount
  ] = UseDefinedValueMemo([
    contextMenuContext.selectedElements.filter(e => e.type === 'folder').length,
    contextMenuContext.selectedElements.filter(e => e.type === 'file').length,
  ]);

  const [
    clipboardFolderCount, 
    clipboardFileCount
  ] = UseDefinedValueMemo([
    clipboardData.elements.filter(e => e.type === 'folder').length,
    clipboardData.elements.filter(e => e.type === 'file').length,
  ]);


  // GETS
  const getPanelStyles = () => {
    if ((contextMenuContext.selectedElements.length > 0) || (clipboardData.elements.length > 0)) {
      return ' h-12'
    } else {
      return ' h-0'
    }
  };

  const getIsClipboardModeActive = () => {
    return clipboardData.elements.length > 0;
  };

  const getClipboardText = () => {
    if (usedClipboardMode === 'cut') {
      return 'Cut'
    } else if (usedClipboardMode === 'copy') {
      return 'Copy  '
    } 
  };


  // RENDER
  return (
    <Box className={`w-full mb-12
    relative overflow-hidden
    bg-sky-400/20
    transition-all duration-300
    ${getPanelStyles()}`}>

      {/* Selection mode */}
      <Box className={`absolute w-full h-12 px-2 py-2
      transition-all duration-300
      flex
      ${getIsClipboardModeActive() ? '-bottom-12' : 'bottom-0'}`}>
        <Box className='flex'>
          <p className='my-auto '>
            {'Select'}
          </p>

          <p className='my-auto ml-2'>
            {selectedFolderCount}
          </p>

          <FolderBs className='h-4 w-4 my-auto ml-1'/>

          <p className='my-auto'>
            {','}
          </p>

          <p className='my-auto ml-1'>
            {selectedFileCount}
          </p>

          <FileEmptyBs className='h-4 w-4 my-auto ml-1'/> 
        </Box>

        <Box className='flex gap-2 ml-auto'>

          <Box className={`button-small
          ${selectedFolderCount > 0 ? 'button-small-inactive' : ''}`}
          onClick={contextMenuContext.copySelectedElements}>
            <Files className='button-small-icon'/>
          </Box>

          <Box className={`button-small ml-auto`}
          onClick={contextMenuContext.cutSelectedElements}>
            <Scissors className='button-small-icon'/>
          </Box>
          
          <Box className={`button-small`}
          onClick={contextMenuContext.removeSelectedElements}>
            <Trash className='button-small-icon'/>
          </Box>

          <Box className={`button-small`}
          onClick={contextMenuContext.clearSelectedElements}>
            <XLg className='button-small-icon'/>
          </Box>
        </Box>

      </Box>

      {/* Clipboard mode */}
      <Box className={`absolute w-full h-12 px-2 py-2
      transition-all duration-300
      flex
      ${getIsClipboardModeActive() ? 'top-0' : '-top-12'}`}>
        <Box className='flex'>
          <p className='my-auto'>
            {getClipboardText()}
          </p>

          <p className='my-auto ml-2'>
            {clipboardFolderCount}
          </p>

          <FolderBs className='h-4 w-4 my-auto ml-1'/>

          <p className='my-auto'>
            {','}
          </p>

          <p className='my-auto ml-1'>
            {clipboardFileCount}
          </p>

          <FileEmptyBs className='h-4 w-4 my-auto ml-1'/> 
        </Box>

        <Box className='flex gap-2 ml-auto'>
          <Box className={`button-small`}
          onClick={contextMenuContext.pasteSelectedElements}>
            <ClipboardMinus className='button-small-icon'/>
          </Box>

          <Box className={`button-small`}
          onClick={() => dispatch(clearClipboard())}>
            <XLg className='button-small-icon'/>
          </Box>
        </Box>

      </Box>
      
    </Box>
  );
}