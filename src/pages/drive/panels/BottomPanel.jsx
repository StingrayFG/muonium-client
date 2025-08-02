import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Slider } from '@mui/material';

import { useIsOnMobile } from 'hooks/UseIsOnMobile';

import { setSidePanelIsEnabled, setGridElementWidth, setListElementHeight } from 'state/slices/settingsSlice';

import commonUtils from 'utils/commonUtils';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext';
import { DrivePageContext } from 'contexts/DrivePageContext';
import { DropzoneContext } from 'contexts/DropzoneContext';

import ZoomSettingsModal from 'pages/drive/modals/ZoomSettingsModal';
import DiskSettingsModal from 'pages/drive/modals/DiskSettingsModal';
import SelectionPanel from 'pages/drive/panels/SelectionPanel';
import CustomSlider from 'components/slider/CustomSlider';

import { ReactComponent as DeviceHdd } from 'assets/icons/device-hdd.svg';
import { ReactComponent as ZoomIn } from 'assets/icons/zoom-in.svg';
import { ReactComponent as Upload } from 'assets/icons/upload.svg';
import { ReactComponent as CaretRightFill } from 'assets/icons/caret-right-fill.svg';
import { ReactComponent as LayoutSidebar } from 'assets/icons/layout-sidebar.svg';
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg';
import { ReactComponent as FileEmptyBs } from 'assets/icons/elements/bootstrap/file-earmark.svg';

import config from 'config.json';


export default function BottomPanel () {
  const dispatch = useDispatch();

  const isOnMobile = useIsOnMobile();

  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);
  const drivePageContext = useContext(DrivePageContext);
  const dropzoneContext = useContext(DropzoneContext);


  // HANDLERS
  const handleSwitchSidePanel = () => {
    drivePageContext.openSidePanel(!drivePageContext.isSidePanelOpen)
    //dispatch(setSidePanelIsEnabled(!settingsData.sidePanelIsEnabled))
  }


  // MODALS
  const openZoomSettingsModal = () => {
    modalContext.openModal(<ZoomSettingsModal />);
  }

  const openDiskSettingsModal = () => {
    modalContext.openModal(<DiskSettingsModal />);
  }

  const getDiskBox = () => {
    return (
      <CustomSlider
      isEnabled={false}
      value={driveData.spaceUsed}
      step={10}
      min={0}
      max={driveData.spaceTotal}>
        <Box className={`flex place-content-center gap-2 px-2
        ${isOnMobile ? '' : 'w-40'}`}
        onClick={openDiskSettingsModal}>
          <p className='button-small-text'>
            {`${commonUtils.parseFileSizeToString(driveData.spaceTotal - driveData.spaceUsed)}`}
          </p>
          <DeviceHdd className='button-small-icon'/>
        </Box>
      </CustomSlider>
    )
  }

  const getZoomBox = () => {
    const getZoomValue = () => {
      if (settingsData.viewMode === 'grid') {
        return ((settingsData.gridElementWidth / config.defaultSettings.gridElementWidth) * 100).toFixed(0) + '%';
      } else if (settingsData.viewMode === 'list') {
        return ((settingsData.listElementHeight / config.defaultSettings.listElementHeight) * 100).toFixed(0) + '%';
      }
    }

    if (settingsData.viewMode === 'grid') {
      return (
        <CustomSlider
        isEnabled={!isOnMobile}
        setValue={(value) => dispatch(setGridElementWidth(value))}
        value={settingsData.gridElementWidth}
        step={10}
        min={config.elements.gridMinWidth}
        max={config.elements.gridMaxWidth}>

          <Box className={`flex place-content-center gap-2 px-2
          ${isOnMobile ? '' : 'w-40 pointer-events-none'}`}
          onClick={openZoomSettingsModal}>
            <p className='button-small-text'>
              {getZoomValue()}
            </p>
            <ZoomIn className='button-small-icon'/>
          </Box>
          
        </CustomSlider>
      )
    } else if (settingsData.viewMode === 'list') {
      return (
        <CustomSlider
        isEnabled={!isOnMobile}
        setValue={(value) => dispatch(setListElementHeight(value))}
        value={settingsData.listElementHeight}
        step={4}
        min={config.elements.listMinHeight}
        max={config.elements.listMaxHeight}>

          <Box className={`flex place-content-center gap-2 px-2
          ${isOnMobile ? '' : 'w-40 pointer-events-none'}`}
          onClick={openZoomSettingsModal}>
            <p className='button-small-text'>
              {getZoomValue()}
            </p>
            <ZoomIn className='button-small-icon'/>
          </Box>

        </CustomSlider>
      )
    }
  }


  // RENDER
  return (
    <Box className='w-full min-h-12
    relative
    shrink-0'
    onContextMenu={contextMenuContext.handleBottomPanelContextMenuClick}>

      { /* Selection panel & wrap*/}
      <SelectionPanel />

      {/* Bottom panel */}
      <Box className={`w-full absolute bottom-0
      bg-gray-950/60 border-t border-sky-300/20`}>

        <Box className={`w-full h-12 px-2 py-2
        flex
        animate-fadein-custom`}>

          {isOnMobile &&
            <Box className='button-small mr-auto'
            onClick={handleSwitchSidePanel}>
              <LayoutSidebar className='button-small-icon'/>
              <CaretRightFill className='button-small-icon -ml-2 -mr-1'/>
            </Box>
          }

          {!isOnMobile && 
            <Box className={`flex mr-auto
            ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}>
              <p className='my-auto'>
                {currentFolderData.folders.length}
              </p>

              <FolderBs className='h-4 w-4 my-auto ml-1'/>

              <p className='my-auto'>
                {','}
              </p>

              <p className='my-auto ml-1'>
                {currentFolderData.files.length}
              </p>

              <FileEmptyBs className='h-4 w-4 my-auto ml-1'/> 
            </Box>
          }
          
          <Box className='separator-vertical' />

          <Box className=''>
            {getZoomBox()}
          </Box>

          <Box className='separator-vertical' />

          <Box className=''>
            {getDiskBox()}
          </Box>

          <Box className='separator-vertical' />
            
          <Box className='button-small'
          onClick={dropzoneContext.open}>
            <Upload className='button-small-icon'/>
          </Box>

        </Box>

      </Box>

    </Box>
  );
}