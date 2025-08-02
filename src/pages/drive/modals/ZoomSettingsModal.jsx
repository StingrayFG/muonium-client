import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import {  setGridElementWidth, setListElementHeight } from 'state/slices/settingsSlice';
import { ModalContext } from 'contexts/ModalContext';

import CommonModal from 'pages/drive/modals/CommonModal';
import CustomSlider from 'components/slider/CustomSlider';

import { ReactComponent as ZoomIn } from 'assets/icons/zoom-in.svg';

import config from 'config.json';


export default function ZoomSettingsModal ({ }) {
  const dispatch = useDispatch();

  const settingsData = useSelector(state => state.settings);

  const modalContext = useContext(ModalContext);


  // HANDLERS
  const handleConfirm = () => {
    modalContext.closeNextModal();
  }


  // GETS
  const getZoomSlider = () => {
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
        setValue={(value) => dispatch(setGridElementWidth(value))}
        value={settingsData.gridElementWidth}
        step={10}
        min={config.elements.gridMinWidth}
        max={config.elements.gridMaxWidth}>

          <Box className={`flex place-content-center gap-2 px-2`}>
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
        setValue={(value) => dispatch(setListElementHeight(value))}
        value={settingsData.listElementHeight}
        step={4}
        min={config.elements.listMinHeight}
        max={config.elements.listMaxHeight}>

          <Box className={`flex place-content-center gap-2 px-2`}>
            <p className='button-small-text'>
              {getZoomValue()}
            </p>
            <ZoomIn class Name='button-small-icon'/>
          </Box>

        </CustomSlider>
      )
    }
  }


  // RENDER
  return(
    <CommonModal 
    header={'Zoom'}
    contents={<Box>

      <Box className='mt-2'>
        {getZoomSlider()}
      </Box>

      <Box className='button-common min-w-full mt-2'
      onClick={handleConfirm}>
        <p className='button-common-text'>
          {'Confirm'}
        </p>   
      </Box>

    </Box>}/>
  )
};