import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import ReactPlayer from 'react-player'
import { useSwipeable } from 'react-swipeable';

import { ContextMenuContext } from 'contexts/ContextMenuContext';
import { ModalContext } from 'contexts/ModalContext';
import FileService from 'services/FileService.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'

import  { env } from 'env.js'


export default function AlbumViewerModal ({ initialFile, allFiles }) {
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);

  const modalContext = useContext(ModalContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const [shownFile, setShownFile] = useState(initialFile)
  const [isSwitchingFIle, setIsSwitchingFIle] = useState(false)
  
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const modalRef = useRef(null);


  // FOCUS
  useEffect(() => {
    modalRef?.current?.focus();
  }, []);


  // RESIZE
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])

  const getIsOnMobile = () => {
    return (windowWidth < 768)
  }

  // IMAGE LOADING
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setIsLoaded(false)
    setImageSrc('')

    if (shownFile.thumbnail) {
      FileService.handleGetImageLink(userData, driveData, { ...shownFile, thumbnail: '' })
      .then(res => {
        //console.log(env.REACT_APP_SERVER_URL + res)
        setIsLoaded(true);
        setImageSrc(env.REACT_APP_SERVER_URL + res);
      })
      .catch(err => {
        //console.log(err)
      })
    } else if (shownFile.imageBlob) {
      setIsLoaded(true);
      setImageSrc(shownFile.imageBlob);
    }
  }, [shownFile])

  const handleOnLoad = () => {
    setIsLoaded(true);
  }


  // SWITCHING FILES
  const getShownFileIndex = () => {
    return allFiles.map(a => a.uuid).indexOf(shownFile.uuid)
  }

  const handleChooseAttachment = (index) => {
    if ((index >= 0) && (index < allFiles.length))
    setShownFile(allFiles[index]);
    setIsSwitchingFIle(true);
  }

  useEffect(() => {
    if (isSwitchingFIle) {
      setIsSwitchingFIle(false);
      modalRef?.current?.focus();
    }
  }, [isSwitchingFIle])
    

  // HANDLERS
  const [mousePositon, setMousePosition] = useState({ x: null, y: null });
  const [canBeClosed, setCanBeClosed] = useState(false)

  const handleOnKeyDown = (event) => {
    //console.log(event)
    if (event.code === 'Escape') { 
      handleClose();
    } else if (event.code === 'ArrowRight') {
      handleChooseAttachment(getShownFileIndex() + 1);
    } else if (event.code === 'ArrowLeft') {
      handleChooseAttachment(getShownFileIndex() - 1);
    } /*else if ((event.code === 'Space') && (['video'].includes(shownFile.generatedData.type))) {
      setIsVideoPlaying(!isVideoPlaying)
    } */
  }

  const handleOnMouseUp = (event) => {
    // Works with delta > ~10 or delta = 0. With delta > 10 the function gets triggered but does not result in 
    // the modal getting closed due to the conditional check. With ~10 > delta > 0 the function doesnt get triggered,
    // therefore the modal isnt getting closed either. Function handleClose() will get called only when delta = 0.
    if (
      (Math.pow(mousePositon.x - event.clientX, 2) + Math.pow(mousePositon.y - event.clientY, 2) < 10) &&
      (event.button === 0) &&
      canBeClosed
    ) {
      setMousePosition({ x: null, y: null });
      setCanBeClosed(false);
      handleClose();
    }
  }

  const handleOnMouseDown = (event) => {
    //console.log(event.target)
    if (['viewer-image', 'viewer-image-blurred', 'viewer-video'].includes(event.target.id)) {
      setMousePosition({ x: event.clientX, y: event.clientY });
      setCanBeClosed(true);
    }
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


  // RENDER
  return(
    <Box className='w-screen h-dvh fixed top-0 left-0 outline-none'
    tabIndex={0}
    ref={modalRef}
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseDown={handleOnMouseDown}> 

      {!isSwitchingFIle && <>
        {(true) &&
          <QuickPinchZoom className=''
          onKeyDown={handleOnKeyDown}
          onUpdate={onUpdate} 
          verticalPadding={0}
          horizontalPadding={0}
          zoomOutFactor={0.1}
          tapZoomFactor={0}
          wheelScaleFactor={500}
          minZoom={1}
          maxZoom={5}
          inertia={false}
          shouldInterceptWheel={() => false}>
  
            <Box className={`w-screen h-screen grid place-items-center`}
            ref={boxRef}>

              <img className={`w-[80%] h-[80%] absolute
              transition-all duration-500 delay-500
              object-contain blur-sm
              ${(isLoaded) ? 'opacity-100' : 'opacity-100'}`}
              src={shownFile?.thumbnail ? 'data:image/png;base64,' + shownFile?.thumbnail : shownFile.imageBlob} 
              ref={imageRef}
              id={'viewer-image-blurred'}
              alt=''/>
  
              {(shownFile?.thumbnail || shownFile.imageBlob) && 
                <img className={`w-[80%] h-[80%] absolute
                transition-all duration-500
                object-contain
                ${(isLoaded) ? 'opacity-100' : 'opacity-0'}`}
                src={imageSrc} 
                onLoad={handleOnLoad}
                id={'viewer-image'}
                alt=''/>
              }

            </Box>
            
          </QuickPinchZoom>
        }

      </>}

      <Box className='h-8 w-8
      cursor-pointer
      fixed top-2 right-2 grid place-content-center
      rounded-full bg-neutral-950/80'
      onClick={handleClose}>
        <XLg className='w-4 h-4'/>     
      </Box>

      <Box className={`w-full px-2 fixed bottom-8
      grid gap-2 overflow-hidden
      transition-all duration-300
      ${((isVideoPlaying) || (allFiles.length === 1)) ? 
      'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <p className='max-w-full px-2 py-1 place-self-center 
        pointer-events-none
        text-ellipsis overflow-hidden
        bg-neutral-950/80 rounded-lg'>
          {shownFile?.name}
        </p>

        <Box className='w-fit max-w-[1000px] h-12 md:h-20 mx-auto
        transition-all duration-300
        place-self-center relative flex gap-2'
        style={{
          left: getIsOnMobile() ? 
          ((((allFiles.length - 1) / 2) - getShownFileIndex()) * (48 + 8)) + 'px' :
          ((((allFiles.length - 1) / 2) - getShownFileIndex()) * (80 + 8)) + 'px'
        }}>

          {allFiles.map((file, index) =>
            <img className={`h-12 w-12 md:h-20 md:w-20
            cursor-pointer
            object-contain
            ${(index === getShownFileIndex()) ? 'opacity-100' : 'opacity-50'}`}
            key={'viewer-file-' + index}
            src={file.thumbnail ? 'data:image/png;base64,' + file?.thumbnail : file.imageBlob}
            onClick={() => handleChooseAttachment(index)}
            alt=''/>
          )}

        </Box>

      </Box>

    </Box>
  )
};