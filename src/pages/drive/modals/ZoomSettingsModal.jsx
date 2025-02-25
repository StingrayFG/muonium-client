import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Slider } from '@mui/material';

import { setSidePanelIsEnabled, setGridElementWidth, setListElementHeight } from 'state/slices/settingsSlice';
import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';

import config from 'config.json';


export default function ZoomSettingsModal ({ }) {
  const dispatch = useDispatch();

  const settingsData = useSelector(state => state.settings);

  const modalContext = useContext(ModalContext);


  // HANDLERS
  const handleConfirm = () => {
    modalContext.closeNextModal();
  }

  const handleOnSliderChange = (event, value) => {
    if (settingsData.viewMode === 'grid') {
      dispatch(setGridElementWidth(value));
    } else if (settingsData.viewMode === 'list') {
      dispatch(setListElementHeight(value));
    } 
  }


  // GETS
  const getZoomSlider = () => {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box className='flex shrink-0'>
          <Box className='h-8 w-full
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
          <Box className='h-8 w-full
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

  return(
    <CommonModal 
    header={'Zoom settings'}
    contents={<Box>

      {getZoomSlider()}

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