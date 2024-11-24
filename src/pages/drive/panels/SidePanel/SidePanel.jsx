import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setSidePanelWidth, setSidePanelIsVisible } from 'state/slices/settingsSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { useDragHandler } from 'hooks/UseDragHandler';

import BookmarkElement from 'pages/drive/elements/BookmarkElement/BookmarkElement.jsx';

import config from 'config.json';


export default function SidePanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);

  const bookmarkData = useSelector(state => state.bookmark);
  const settingsData = useSelector(state => state.settings);

  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging, updateDelta] = useDragHandler(0);

  const [panelWidth, setPanelWidth] = useState(settingsData.sidePanelWidth);

  
  // CONFIG
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])

  useEffect(() => {
    if ((windowWidth - panelWidth) < config.contentsPanel.minWidth) {
      setPanelWidth(windowWidth - config.contentsPanel.minWidth);
      dispatch(setSidePanelWidth(windowWidth - config.contentsPanel.minWidth));
    }
  }, [windowWidth])


  // HANDLERS
  const handleOnMouseDown = (event) => {
    startDragging(event);
    dispatch(setSidePanelWidth(panelWidth));
  }

  const handleOnMouseUp = (event) => {
    stopDragging(event);
    dispatch(setSidePanelWidth(panelWidth));
  } 

  const handleOnMouseMove = (event) => {
    updateDragging(event);
    if (isDragging) {
      if (((settingsData.sidePanelWidth + dragDelta.x) > config.sidePanel.minWidth) && 
      ((windowWidth - (settingsData.sidePanelWidth + dragDelta.x)) > config.contentsPanel.minWidth)) {
        setPanelWidth(settingsData.sidePanelWidth + dragDelta.x);
      }   
    }
  }
  

  // GETS
  const [usedIsVisible, setUsedIsVisible] = useState(settingsData.sidePanelIsVisible);
  const [isChangingIsVisible, setIsChangingIsVisible] = useState(false)

  useEffect(() => {
    if (usedIsVisible !== settingsData.sidePanelIsVisible) {
      setIsChangingIsVisible(true);
      setUsedIsVisible(settingsData.sidePanelIsVisible);
      setTimeout(() => setIsChangingIsVisible(false), 300);
    }
  }, [settingsData.sidePanelIsVisible])
  
  const getSidePanelStyle = () => {
    if (isChangingIsVisible) {
      return 'duration-300'
    } else {
      return 'duration-0'
    }
  }

  const handleOverlayPanelClick = () => {
    dispatch(setSidePanelIsVisible(!settingsData.sidePanelIsVisible))
  }


  // RENDER
  return (
    <Box className={`h-full pr-2 -mr-2 z-20
    transition-opacity duration-300
    ${settingsData.sidePanelIsOverlayMode ? 'fixed left-0' : isDragging ? 'static' : 'relative'}
    ${usedIsVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-100'}`}
    onContextMenu={contextMenuContext.handleSidePanelContextMenuClick}>

      <Box className={`z-10
      cursor-col-resize
      ${isDragging ? 'fixed h-dvh w-screen top-0 left-0' : 'absolute h-full w-4 right-0'}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}/> {/* Used to stop resizing if mouse leaves the window */}


      <Box className={`w-screen h-full absolute left-0 z-[-10] 
      backdrop-blur-sm bg-gray-950/40
      transition-all duration-300
      ${(usedIsVisible && settingsData.sidePanelIsOverlayMode) ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} 
      onClick={handleOverlayPanelClick}/>

      <Box className={`h-full overflow-y-auto overflow-x-hidden
      transition-all
      scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
      border-r border-sky-300/20
      ${settingsData.sidePanelIsOverlayMode ? 'bg-gray-950/90' : 'bg-neutral-950/40'}
      ${getSidePanelStyle()}`}
      style={{
        width: usedIsVisible ? panelWidth : '0px'
      }}>

        <Box className='w-full h-8 px-2 flex
        opacity-50
        select-none pointer-events-none'>
          <p className='place-self-center'>Places</p>
        </Box>

        <BookmarkElement bookmark={{ folder: { uuid: 'home', name:'Home' } }}/>

        <BookmarkElement bookmark={{ folder: { uuid: 'trash', name:'Trash' } }}/>

        <Box className='w-full h-8 px-2 flex 
        opacity-50
        select-none pointer-events-none'>
          <p className='place-self-center'>Bookmarks</p>
        </Box>

        {bookmarkData.bookmarks.map((bookmark) => (
          <BookmarkElement key={bookmark.uuid} bookmark={bookmark}/>
        ))}
      </Box>

    </Box>
  );
}