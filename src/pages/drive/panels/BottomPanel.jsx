import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Slider } from '@mui/material';

import { setSidePanelIsEnabled, setGridElementWidth, setListElementHeight } from 'state/slices/settingsSlice';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext';
import { DrivePageContext } from 'contexts/DrivePageContext';

import ZoomSettingsModal from 'pages/drive/modals/ZoomSettingsModal';
import DriveSettingsModal from 'pages/drive/modals/DriveSettingsModal';

import { ReactComponent as ChevronBarLeft } from 'assets/icons/chevron-bar-left.svg'
import { ReactComponent as DeviceHdd } from 'assets/icons/device-hdd.svg'
import { ReactComponent as ZoomIn } from 'assets/icons/zoom-in.svg'
import { ReactComponent as ListUl } from 'assets/icons/list-ul.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { ReactComponent as JournalBookmark } from 'assets/icons/journal-bookmark.svg'
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg'
import { ReactComponent as FileEmptyBs } from 'assets/icons/elements/bootstrap/file-earmark.svg'

import config from 'config.json';


export default function BottomPanel () {
  const dispatch = useDispatch();

  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);
  const drivePageContext = useContext(DrivePageContext);


  // HANDLERS
  const handleOnSliderChange = (event, value) => {
    if (settingsData.viewMode === 'grid') {
      dispatch(setGridElementWidth(value));
    } else if (settingsData.viewMode === 'list') {
      dispatch(setListElementHeight(value));
    } 
  }

  const handleSwitchSidePanel = () => {
    drivePageContext.openSidePanel(!drivePageContext.isSidePanelOpen)
    //dispatch(setSidePanelIsEnabled(!settingsData.sidePanelIsEnabled))
  }


  // MODALS
  const openZoomSettingsModal = () => {
    modalContext.openModal(<ZoomSettingsModal />);
  }

  const openDriveSettingsModal = () => {
    modalContext.openModal(<DriveSettingsModal />);
  }


  // GETS
  const getParsedFileSize = (size) => {
    let res = '';
    if (size > Math.pow(1024, 3)) { res += (((size / Math.pow(1024, 3)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 3)) + '').length + 2) + ' GiB') } 
    else if (size > Math.pow(1024, 2)) { res += (((size / Math.pow(1024, 2)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 2)) + '').length + 2) + ' MiB') } 
    else if (size > Math.pow(1024, 1)) { res += (((size / Math.pow(1024, 1)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 1)) + '').length + 2) + ' KiB') } 
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
        res += (' (' + getParsedFileSize(fileSizesSum) + ')');
      }

      if (clipboardData.mode === 'copy') { res += ' copied'; } 
      else if (clipboardData.mode === 'cut') { res += ' cut'; } 
      else { res += ' selected'; }
      
    } else if (contextMenuContext.hoveredElement.uuid && (contextMenuContext.hoveredElement.type !== 'bookmark')) {
      if (contextMenuContext.hoveredElement.type === 'file') {
        res += (
          contextMenuContext.hoveredElement.name + ' (' + 
          contextMenuContext.hoveredElement.type + ', ' + 
          getParsedFileSize(contextMenuContext.hoveredElement.size) + ')'
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

  const getZoomSlider = () => {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box className='flex shrink-0'>
          <Box className='h-8 w-40 
          grid relative 
          border-sky-300/20 border rounded'>
            <Box className='absolute w-full opacity-0'>
              <Slider 
              onChange={handleOnSliderChange}
              value={settingsData.gridElementWidth}
              step={10}
              min={config.elements.gridMinWidth}
              max={config.elements.gridMaxWidth} />
            </Box>

            <Box className='h-full absolute pointer-events-none
            bg-sky-400/20 rounded-[0.2rem]'
            style={{
              width: (((settingsData.gridElementWidth - config.elements.gridMinWidth) / (config.elements.gridMaxWidth - config.elements.gridMinWidth)) * 100) + '%'
            }}/>

            <p className='place-self-center'>
              {'Zoom: ' + ((settingsData.gridElementWidth / config.defaultSettings.gridElementWidth) * 100).toFixed(0) + '%'} 
            </p>
          </Box>
        </Box>
      )
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box className='flex shrink-0'>
          <Box className='h-8 w-40
          grid relative 
          border-sky-300/20 border rounded'>
            <Box className='absolute w-full opacity-0'>
              <Slider 
              onChange={handleOnSliderChange}
              value={settingsData.listElementHeight}
              step={4}
              min={config.elements.listMinHeight}
              max={config.elements.listMaxHeight} />
            </Box>

            <Box className='h-full absolute pointer-events-none
            bg-sky-400/20 rounded-[0.2rem]'
            style={{
              width: (((settingsData.listElementHeight - config.elements.listMinHeight) / (config.elements.listMaxHeight - config.elements.listMinHeight)) * 100) + '%'
            }}/>

            <p className='place-self-center'>
              {'Zoom: ' + ((settingsData.listElementHeight / config.defaultSettings.listElementHeight) * 100).toFixed(0) + '%'} 
            </p>
          </Box>
        </Box>
      )
    }
  }

  const getZoomText = () => {
    if (settingsData.viewMode === 'grid') {
      return ((settingsData.gridElementWidth / config.defaultSettings.gridElementWidth) * 100).toFixed(0) + '%';
    } else if (settingsData.viewMode === 'list') {
      return ((settingsData.listElementHeight / config.defaultSettings.listElementHeight) * 100).toFixed(0) + '%';
    }
  }

  const getUsageText = () => {
    return ((driveData.spaceTotal - driveData.spaceUsed) / (1024 * 1024)).toFixed(0) + ' MiB free ';
  }


  // RENDER
  return (
    <Box className='w-full min-h-12 px-2 py-2
    shrink-0 
    bg-gray-900/60 backdrop-blur-sm border-sky-300/20 border-t'
    onContextMenu={contextMenuContext.handleBottomPanelContextMenuClick}>

      <Box className='w-full
      overflow-hidden
      flex md:hidden relative'>

        <Box className='button-small mr-auto'
        onClick={handleSwitchSidePanel}>
          <JournalBookmark className='button-small-icon'/>
          <ChevronRight className='button-small-icon'/>
        </Box>

        <Box className={`h-8 absolute right-0 
        transition-all duration-300
        flex
        ${(contextMenuContext.clickedElements.length === 0) ? '-top-12' : 'top-0'}`}>
          <Box className='separator-vertical' />

          <Box className={`h-6 min-w-12 px-2 my-auto
          transition-all duration-300
          relative grid place-items-center overflow-hidden
          pointer-events-none
          bg-sky-400/20 rounded-full`}
          style={{
            width: (16 + ((contextMenuContext.clickedElements.filter(e => e.type === 'folder').length + '').length * 8)) + 'px'
          }}>
            <FolderBs className='h-4 w-4 absolute left-2'/>

            {Array.from(Array(5).keys())
            .map(count => count + contextMenuContext.clickedElements.filter(e => e.type === 'folder').length - 2)
            .map(count =>
              <p key={'selection-count-number-' + count}
              className={`absolute right-2
              transition-all duration-300
              text-neutral-200
              ${count < contextMenuContext.clickedElements.filter(e => e.type === 'folder').length && '-top-6'}
              ${count === contextMenuContext.clickedElements.filter(e => e.type === 'folder').length && 'top-0'}
              ${count > contextMenuContext.clickedElements.filter(e => e.type === 'folder').length && 'top-6'}`}>
                {count}
              </p>
            )}
          </Box>

          <Box className={`h-6 min-w-12 px-2 ml-2 my-auto
          transition-all duration-300
          relative grid place-items-center overflow-hidden
          pointer-events-none
          bg-sky-400/20 rounded-full`}
          style={{
            width: (16 + ((contextMenuContext.clickedElements.filter(e => e.type === 'file').length + '').length * 8)) + 'px'
          }}>
            <FileEmptyBs className='h-4 w-4 absolute left-2'/>

            {Array.from(Array(5).keys())
            .map(count => count + contextMenuContext.clickedElements.filter(e => e.type === 'file').length - 2)
            .map(count =>
              <p key={'selection-count-number-' + count}
              className={`absolute right-2
              transition-all duration-300
              text-neutral-200
              ${count < contextMenuContext.clickedElements.filter(e => e.type === 'file').length && '-top-6'}
              ${count === contextMenuContext.clickedElements.filter(e => e.type === 'file').length && 'top-0'}
              ${count > contextMenuContext.clickedElements.filter(e => e.type === 'file').length && 'top-6'}`}>
                {count}
              </p>
            )}
          </Box>

        </Box>

        <Box className={`absolute right-0
        transition-all duration-300
        flex
        ${(contextMenuContext.clickedElements.length === 0) ? 'top-0' : 'top-12'}`}>
          <Box className='separator-vertical' />
          
          <Box className='button-small'
          onClick={openZoomSettingsModal}>
            <p className='button-small-text'>
              {getZoomText()}
            </p>
            <ZoomIn className='button-small-icon'/>
          </Box>

          <Box className='separator-vertical' />

          <Box className='button-small'
          onClick={openDriveSettingsModal}>
            <p className='button-small-text'>
              {Math.round((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%'}
            </p>
            <DeviceHdd className='button-small-icon'/>
          </Box>
        </Box>

      </Box>


      <Box className='w-full 
      hidden md:grid grid-cols-[1fr_max-content] overflow-hidden'>

        <p className={`w-full my-auto pr-2
        transition-all duration-300
        text-left whitespace-nowrap break-keep text-ellipsis overflow-hidden
        ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}>
          {getSelectionText()}
        </p>  
        
        <Box className='flex'>
          <Box className='separator-vertical' />

          {getZoomSlider()}

          <Box className='separator-vertical' />

          <Box className='flex shrink-0'>
            <Box className='min-w-40 h-8 
            grid relative
            border-sky-300/20 border rounded'
            onClick={openDriveSettingsModal}>

              <Box className={`h-full absolute
              bg-sky-400/20 rounded-[0.2rem]
              transition-all duration-300
              ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
              style={{
                width: ((driveData.spaceUsed / driveData.spaceTotal) * 100) + '%'
              }}/>

              <p className={`place-self-center
              transition-all duration-300
              ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}>
                {getUsageText()} 
              </p>
            </Box>

          </Box>
        </Box>
        
        
      </Box>

    </Box>
  );
}