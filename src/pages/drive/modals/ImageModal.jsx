import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

import { ModalContext } from 'contexts/ModalContext';

import FileService from 'services/FileService.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'



export default function ImageModal ({ file }) {

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);

  const modalContext = useContext(ModalContext);

  const [isLoaded, setIsLoaded] = useState(false);
  
  const boxRef = useRef();
  const imgRef = useRef();


  // IMAGE
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (file.thumbnail) {
      FileService.handleGetImageLink(userData, driveData, file)
      .then(res => {
        setIsLoaded(true);
        setImageSrc(res);
      })
      .catch(() => {
        setIsLoaded(true);
        setImageSrc('');
      })
    } else {
      setIsLoaded(true);
      setImageSrc(file.imageBlob);
    }
  }, [file])


  // HANDLERS
  const [mousePositon, setMousePosition] = useState({ x: null, y: null });

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      handleClose();
    }
  }

  const handleOnMouseUp = (event) => {
    if (Math.pow(mousePositon.x - event.clientX, 2) + Math.pow(mousePositon.y - event.clientY, 2) < 10) {
      setMousePosition({ x: null, y: null });
      handleClose();
    }
  }

  const handleOnMouseDown = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleClose = () => {
    modalContext.closeNextModal();
  }


  // IMAGE ZOOM
  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: box } = boxRef;
    if (box) {
      const value = make3dTransformValue({ x, y, scale });
      box.style.setProperty('transform', value);
    }
  }, [window]);

  
  return(
    <Box className='w-screen h-screen' 
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseDown={handleOnMouseDown}> 

      <QuickPinchZoom className='' 
      onUpdate={onUpdate} 
      verticalPadding={0}
      horizontalPadding={0}
      zoomOutFactor={0.1}
      wheelScaleFactor={500}
      minZoom={1}
      maxZoom={5}
      inertia={false}
      shouldInterceptWheel={() => false}>

        <Box className='w-screen h-screen grid place-items-center'
        ref={boxRef}>
          {(isLoaded && imageSrc) && 
            <img className='w-[80%] h-[80%] absolute
            object-contain'
            src={imageSrc} />
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