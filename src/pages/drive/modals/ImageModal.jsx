import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

import { useDetectDragDelta } from 'hooks/UseDetectDragDelta';

import { ModalContext } from 'contexts/ModalContext';

import FileService from 'services/FileService.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'



export default function ImageModal ({ file }) {

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);

  const modalContext = useContext(ModalContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLink, setImageLink] = useState('');

  const boxRef = useRef();
  const imgRef = useRef();

  const [dragDelta, dragOnMouseDown, dragOnMouseUp] = useDetectDragDelta();


  const getImageLink = async () => {
    await FileService.handleGetImageLink(userData, driveData, file)
    .then(res => {
      setIsLoaded(true);
      setImageLink(res);
    })
    .catch(err => {
      setIsLoaded(true);
      setImageLink('');
    })
  }

  useEffect(() => {
    getImageLink();
  }, [])

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      modalContext.closeNextModal();
    }
  }

  const handleClose = () => {
    modalContext.closeNextModal();
  }

  useEffect(() => {
    if ((dragDelta.x !== null) && (dragDelta.y !== null) && 
    ((Math.abs(dragDelta.x) < 10) && (Math.abs(dragDelta.y) < 10))) {
      modalContext.closeNextModal();
    }
  }, [dragDelta])

  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: box } = boxRef;
    if (box) {
      const value = make3dTransformValue({ x, y, scale });
      box.style.setProperty('transform', value);
    }
  }, []);


  return(
    <Box className='w-screen h-screen'
    onKeyDown={handleOnKeyDown}
    onMouseDown={dragOnMouseDown}
    onMouseUp={dragOnMouseUp}>

      <QuickPinchZoom className=''
      onUpdate={onUpdate} 
      verticalPadding={0}
      horizontalPadding={0}
      zoomOutFactor={0.1}
      wheelScaleFactor={500}
      shouldInterceptWheel={() => false}>

        <Box className='w-screen h-screen grid place-items-center'
        ref={boxRef}>
          {(isLoaded && imageLink) && 
            <img className='w-[80%] h-[80%] absolute
            object-contain'
            src={imageLink} />
          }

          <img className={`w-[80%] h-[80%] absolute
          transition-all duration-500
          object-contain blur-sm
          ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          src={'data:image/png;base64,' + file.thumbnail} 
          ref={imgRef}/>
        </Box>
        
      </QuickPinchZoom>

      <button className='h-12 w-12 absolute top-0 right-0 grid place-content-center
      hover:opacity-50 hover:bg-transparent bg-transparent'
      onClick={handleClose}>
        <Box className='h-8 w-8 m-2 grid
        rounded-full bg-black/40'>
          <XLg className='w-5 h-5 place-self-center'/>
        </Box>      
      </button>

    </Box>
  )
};