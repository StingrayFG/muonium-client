import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import ReactPlayer from 'react-player'

import { useIsOnMobile } from 'hooks/UseIsOnMobile';
import { useWindowSize } from 'hooks/UseWindowSize';

import commonUtils from 'utils/commonUtils';

import { ModalContext } from 'contexts/ModalContext';

import FileService from 'services/FileService.jsx';

import FileElementIcon from 'pages/drive/elements/FileElement/FileElementIcon';
import MuoniumSpinner from 'components/spinner/MuoniumSpinner';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'

import { env } from 'env.js'




export default function AlbumViewerModal ({ initialFile, allFiles }) {
  const isOnMobile = useIsOnMobile();
  const windowSize = useWindowSize();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);

  const modalContext = useContext(ModalContext);
  

  //
  const [shownFileData, setShownFileData] = useState((() => {
    const initialThumbnail = initialFile?.thumbnail ? 
    'data:image/png;base64,' + initialFile?.thumbnail : initialFile?.fileBlob;
    const img = new Image();
    img.src = initialThumbnail;

    return {
      file: initialFile,
      thumbnail: initialThumbnail,
      link: null,
      aspectRatio: img.width / img.height
    }
  })())

  const [isSwitchingFile, setIsSwitchingFile] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isLinkLoaded, setIsLinkLoaded] = useState(false); // do not remove, it is used for triggering updates

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const boxRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const modalRef = useRef(null);


  // FOCUS
  useEffect(() => {
    modalRef?.current?.focus();
  }, []);


  // IMAGE LOADING
  useEffect(() => {
    if (!shownFileData.link) {
      let newShownFileData = shownFileData;
      setIsLinkLoaded(false)

      if (shownFileData.fileBlob) {
        newShownFileData.link = shownFileData?.file?.fileBlob;
        setShownFileData(newShownFileData);

      } else {
        FileService.handleGetFileLink(userData, driveData, { ...shownFileData.file, thumbnail: '' })
        .then(res => {
          newShownFileData.link = env.REACT_APP_SERVER_URL + res;
          //console.log(env.REACT_APP_SERVER_URL + res);

          setShownFileData(newShownFileData);
          setIsLinkLoaded(true);
        })
        .catch(err => {
          console.log(err);
        })
      }
    }
  }, [shownFileData.file])

  const handleOnLoad = () => {
    console.log('load')
    setIsFileLoaded(true);
  }


  // SWITCHING FILES
  const getShownFileIndex = () => {
    return allFiles.map(a => a.uuid).indexOf(shownFileData?.file?.uuid);
  }

  const handleChooseAttachment = (index) => {
    if ((index >= 0) && 
    (index < allFiles.length) &&
    (index !== getShownFileIndex())) {
      const thumbnail = allFiles[index]?.thumbnail ? 
      'data:image/png;base64,' + allFiles[index]?.thumbnail : allFiles[index]?.fileBlob;

      let img = new Image();
      img.src = thumbnail;

      let newShownFileData = {
        file: allFiles[index],
        thumbnail: thumbnail,
        link: null,
        aspectRatio: img.width / img.height
      }
      
      setShownFileData(newShownFileData)
      setImageWrapStyle(getImageWrapStyle(newShownFileData))
      setIsFileLoaded(false);
      setIsSwitchingFile(true);
    }
  }

  useEffect(() => {
    if (isSwitchingFile) {
      setIsSwitchingFile(false);
      modalRef?.current?.focus();
    }
  }, [isSwitchingFile])
    

  // IMAGE WRAP
  const getImageWrapStyle = (shownFileData) => {
    const screenAspectRatio = windowSize.width / windowSize.height;

    if (shownFileData.aspectRatio < screenAspectRatio) { 
      return {
        height: `80vh`,
        width: `${80 * shownFileData.aspectRatio}vh`,
      }
    } else {
      return {
        height: `${80 / shownFileData.aspectRatio}vw`,
        width: `80vw`,
      }
    }
  }

  const [imageWrapStyle, setImageWrapStyle] = useState(getImageWrapStyle(shownFileData));

  const getAlbumRowStyle = () => {
    const size = isOnMobile ? 48 : 80;

    return {
      height: `${size}px`,
      left: `${(((allFiles.length - 1) / 2) - getShownFileIndex()) * (size * 1.25)}px`
    }
  }

  const getAlbumElementStyle = (index) => {
    const size = isOnMobile ? 48 : 80;

    return {
      height: `${size}px`,
      width: `${size}px`,
      opacity: `${(index === getShownFileIndex()) ? '100%' : '50%'}`
    }
  }
  
  const getAlbumElementImage = (file, index) => {
    if (file?.thumbnail || file?.fileBlob) {
      return <img className={`
        object-contain`}
        style={getAlbumElementStyle()}
        key={'viewer-file-' + index}
        src={file?.thumbnail ? 'data:image/png;base64,' + file?.thumbnail : file?.fileBlob}
        onClick={() => handleChooseAttachment(index)}
        alt=''/>
    } else {
      return <Box style={getAlbumElementStyle()}
      key={'viewer-file-' + index}
      onClick={() => handleChooseAttachment(index)}>
      <FileElementIcon type='audio' />
      </Box>
    }

  }

  // HANDLERS
  const [mousePositon, setMousePosition] = useState({ x: null, y: null });
  const [canBeClosed, setCanBeClosed] = useState(false);

  const handleOnKeyDown = (event) => {
    //console.log(event)
    if (event.code === 'Escape') { 
      handleClose();
    } else if (event.code === 'ArrowRight') {
      handleChooseAttachment(getShownFileIndex() + 1);
    } else if (event.code === 'ArrowLeft') {
      handleChooseAttachment(getShownFileIndex() - 1);
    } else if ((event.code === 'Space') && 
    ['video'].includes(commonUtils.getFileTypeFromName(shownFileData?.file?.name))) {
      setIsVideoPlaying(!isVideoPlaying)
    } 
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
    if (['viewer-image', 'viewer-video'].includes(event.target.id)) {
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

      {!isSwitchingFile && <>
        {['image'].includes(commonUtils.getFileTypeFromName(shownFileData?.file?.name)) && 
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
  
            <Box className={`w-screen h-dvh 
            grid place-items-center`}
            ref={boxRef}>
              
              <Box className={`max-h-[80vh] max-w-[80vw]
              relative grid place-items-center overflow-hidden`}
              style={imageWrapStyle}>

                <Box className={`max-w-full max-h-full absolute
                pointer-events-none
                grid place-items-center
                transition-all duration-500 delay-500
                ${isFileLoaded ? 'opacity-0' : 'opacity-100 blur-[2px]'}`}
                style={imageWrapStyle}>
                  <Box className='w-full h-full checker'/>

                  <img id={'viewer-image'} 
                  alt=''
                  src={shownFileData?.thumbnail} 
                  className={`h-full absolute`}/>
                </Box>

                <img id={'viewer-image'}
                ref={imageRef}
                alt=''
                src={shownFileData?.link} 
                className={`w-full h-full absolute
                transition-opacity duration-500
                object-contain
                ${isFileLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleOnLoad}/>

              </Box>

            </Box>
            
          </QuickPinchZoom>
        }

        {['video'].includes(commonUtils.getFileTypeFromName(shownFileData?.file?.name)) && 
          <Box className='w-screen h-dvh 
          grid place-items-center'
          id={'viewer-video'}>
            
            <Box className='w-fit h-fit
            relative flex overflow-hidden'>

              <Box className={`max-w-full max-h-full absolute
              pointer-events-none
              grid place-items-center
              transition-all duration-500
              ${isFileLoaded ? 'opacity-0' : 'opacity-100'}`}
              style={imageWrapStyle}>

                <img id={'viewer-image'} 
                alt=''
                src={shownFileData?.thumbnail} 
                className={`h-full absolute blur-[8px]`}/>

                <MuoniumSpinner size={80} shallSpin={true}/>
              </Box>

              <ReactPlayer 
              style={{
                maxWidth: '100vw',
                maxHeight: '80vh'
              }}
              ref={videoRef}
              url={shownFileData?.link}
              playing={isVideoPlaying}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onReady={handleOnLoad}
              controls/>
              
            </Box>

          </Box>
        }

        {['audio'].includes(commonUtils.getFileTypeFromName(shownFileData?.file?.name)) && 
          <Box className='w-screen h-dvh 
          grid place-items-center'
          id={'viewer-video'}>

            <Box className='w-fit h-fit'>
              
              {shownFileData?.thumbnail && 
                <Box className='relative mb-10'>
                  {/*<Box className='w-full h-full object-fill absolute 
                  overflow-hidden'>
                    <img className='w-full h-full blur-[8px]'
                    src={shownFileData?.thumbnail}/>
                  </Box>*/}
                  
                  <Box className='max-w-[40vw] max-h-[40vh] mx-auto relative 
                  aspect-square'>
                    <img className='w-full h-full object-contain'
                    src={shownFileData?.thumbnail}/>
                  </Box>
                </Box>
              }

              <ReactPlayer 
              style={{
                maxWidth: '100vw',
                maxHeight: '80vh',
                position: 'relative',
              }}
              height={40}
              ref={videoRef}
              url={shownFileData?.link}
              playing={isVideoPlaying}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              controls/>
            </Box>

          </Box>
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
        text-center second-line-ellipsis
        bg-neutral-950/80 rounded-lg'>
          {shownFileData?.file?.name}
        </p>

        <Box className={`w-fit max-w-[80vw] mx-auto
        transition-all duration-300
        place-self-center relative flex gap-2`}
        style={getAlbumRowStyle()}>

          {allFiles.map((file, index) =>
            getAlbumElementImage(file, index)
          )}

        </Box>

      </Box>

    </Box>
  )
};