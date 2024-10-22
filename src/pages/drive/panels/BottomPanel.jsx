import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Slider } from '@mui/material';

import { setElementSize, setSidePanelIsVisible } from 'state/slices/settingsSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as ChevronBarLeft } from 'assets/icons/chevron-bar-left.svg'

import config from 'config.json';


export default function BottomPanel () {
  const dispatch = useDispatch();

  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);


  // HANDLERS
  const handleSlider = (event, value) => {
    dispatch(setElementSize(value));
  }

  const changeSidePanelIsVisible = () => {
    dispatch(setSidePanelIsVisible(!settingsData.sidePanelIsVisible))
  }


  // GETS
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

  const getZoomText = () => {
    return 'Zoom: ' + ((settingsData.elementSize / config.defaultSettings.elementSize) * 100).toFixed(0) + '%';
  }

  const getUsageText = () => {
    return ((driveData.spaceTotal - driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MiB / ' +
    (driveData.spaceTotal / (1024 * 1024)).toFixed(0) + ' MiB'
  }


  // RENDER
  return (
    <Box className='w-full px-2 py-2 absolute bottom-0
    overflow-hidden flex
    bg-gray-900/60 border-sky-300/20 border-t backdrop-blur'
    onContextMenu={contextMenuContext.handleBottomPanelContextMenuClick}>

      <Box className='flex'>
        <button className={`w-8 h-8 grid button-small`}
        onClick={changeSidePanelIsVisible}>
          <ChevronBarLeft className={`place-self-center h-5 w-5 pointer-events-none
          transition-all duration-300
          ${settingsData.sidePanelIsVisible ? '' : 'rotate-180'}`}/>
        </button>
      </Box>

      <Box className='separator-vertical' />

      <p className='w-full h-8 pr-2
      text-left text-ellipsis overflow-hidden'>
        {getSelectionText()}
      </p>  

      <Box className='separator-vertical' />

      <Box className='flex shrink-0'>
        <Box className='h-8 w-40 relative 
        border-sky-300/20 border rounded-[0.3rem]'>
          <Box className='absolute w-full opacity-0'>
            <Slider 
            onChange={handleSlider}
            value={settingsData.elementSize}
            step={10}
            min={config.element.minSize}
            max={config.element.maxSize} />
          </Box>

          <Box className='h-full absolute pointer-events-none
          bg-sky-400/20 rounded-[0.2rem]'
          style={{
            width: (((settingsData.elementSize - config.element.minSize) / (config.element.maxSize - config.element.minSize)) * 100) + '%'
          }}/>

          <p className='px-2 place-self-center text-center'>
            {getZoomText()} 
          </p>
        </Box>
      </Box>

      <Box className='separator-vertical' />

      <Box className='flex shrink-0'>
        <Box className='h-8 relative 
        border-sky-300/20 border rounded-[0.3rem]'>
          <Box className='h-full absolute
          bg-sky-400/20 rounded-[0.2rem]'
          style={{
            width: ((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%'
          }}/>

          <p className='px-4 h-8'>
            {getUsageText()} 
          </p>
        </Box>
      </Box>

    </Box>
  );
}