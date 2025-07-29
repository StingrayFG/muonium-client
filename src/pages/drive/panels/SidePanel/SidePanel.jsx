import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { useDragHandler } from 'hooks/UseDragHandler';
import { useIsOnMobile } from 'hooks/UseIsOnMobile';

import { setSidePanelWidth, setSidePanelIsEnabled } from 'state/slices/settingsSlice';
import { getBookmarks } from 'state/slices/bookmarkSlice';
import { moveToNew } from 'state/slices/pathSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { DrivePageContext } from 'contexts/DrivePageContext';

import BookmarkElement from 'pages/drive/elements/BookmarkElement/BookmarkElement.jsx';

import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as JournalBookmark } from 'assets/icons/journal-bookmark.svg'
import { ReactComponent as House } from 'assets/icons/house.svg'
import { ReactComponent as Trash } from 'assets/icons/trash.svg'

import config from 'config.json';


export default function SidePanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);
  const drivePageContext = useContext(DrivePageContext);

  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);
  const settingsData = useSelector(state => state.settings);
  const pathData = useSelector(state => state.path);

  const isOnMobile = useIsOnMobile();
  const [dragData, dragFunctions] = useDragHandler(0);

  const [panelWidth, setPanelWidth] = useState(settingsData.sidePanelWidth);


  // UPDATE
  const [hasLoadedBookmarks, setHasLoadedBookmarks] = useState(false);

  useEffect(() => {
    if (userData) {
      dispatch(getBookmarks(userData))
      .then(() => { 
        setHasLoadedBookmarks(true);
      })
    }
  }, [])


  // CONFIG
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])
  
  useEffect(() => {
    if (((windowWidth - panelWidth) < config.contentsPanel.minWidth) && !isOnMobile) {
      setPanelWidth(windowWidth - config.contentsPanel.minWidth);
      dispatch(setSidePanelWidth(windowWidth - config.contentsPanel.minWidth));
    }
  }, [windowWidth])


  // HANDLERS
  const handleOnMouseDown = (event) => {
    dragFunctions.startDragging(event);
    dispatch(setSidePanelWidth(panelWidth));
  }

  const handleOnMouseUp = (event) => {
    dragFunctions.stopDragging(event);
    dispatch(setSidePanelWidth(panelWidth));
  } 

  const handleOnMouseMove = (event) => {
    dragFunctions.updateDragging(event);
    if (dragData.isDragging &&
    ((settingsData.sidePanelWidth + dragData.dragDelta.x) > config.sidePanel.minWidth) && 
    ((windowWidth - (settingsData.sidePanelWidth + dragData.dragDelta.x)) > config.contentsPanel.minWidth)) {
      setPanelWidth(settingsData.sidePanelWidth + dragData.dragDelta.x);
    }
  }

  const closeSidePanel = () => {
    drivePageContext.closeSidePanel();
  }

  const handleOnBookmarkMouseDown = (event, bookmark) => {
    if (event.button === 0) {   
      contextMenuContext.clearSelectedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }


  // ELEMENT FUNCTIONS
  const getIsSelected = (bookmark) => {
    return (pathData && (bookmark.folder.uuid === pathData.currentUuid));
  }

  const getGeneratedIcon = (bookmark) => {
    const iconStyle = 'h-5 w-5 mt-1.5';

    if (bookmark.folder.uuid === 'home') {
      return <House className={iconStyle}/>
    } else if (bookmark.folder.uuid === 'trash') {
      return <Trash className={iconStyle}/>
    } else {
      return <Box className={iconStyle}/>
    }
  }

  const getWrapStylesString = () => {
    if (isOnMobile) {
      return `w-[80vw] 
      fixed top-0 left-[${drivePageContext.isSidePanelOpen ? 0 : -80}vw]
      transition-all duration-300`;
    } else {
      return `relative 
      transition-opacity duration-300`;
    }
  }

  const getPanelStyles = () => {
    return { 
      width: isOnMobile ? '100%' : panelWidth + 'px',
      duration: dragData.isHolding ? 'duration-0' : 'duration-300'
    };
  }


  // RENDER
  const homeBookmark = { 
    folder: {
      uuid: 'home', 
      name: 'Home' 
    }
  }

  const trashBookmark = { 
    folder: {
      uuid: 'trash', 
      name: 'Trash' 
    }
  }

  const getBookmarkProps = (bookmark) => {
    return {
      generatedIcon: getGeneratedIcon(bookmark),
      isSelected: getIsSelected(bookmark),
      handleOnBookmarkMouseDown: handleOnBookmarkMouseDown
    }
  }

  return (
    <Box className={`h-full pr-2 -mr-2 z-20
    overflow-hidden
    shrink-0  
    ${getWrapStylesString()}`}
    onContextMenu={contextMenuContext.handleSidePanelContextMenuClick}
    onMouseDown={contextMenuContext.handleOnWrapMouseDown}>

      {/* Resize handle */}
      <Box className={`z-10
      pointer-events-none md:pointer-events-auto
      cursor-col-resize
      ${dragData.isDragging ? 'fixed h-dvh w-screen top-0 left-0' : 'absolute h-full w-4 right-0'}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}/> {/* Used to stop resizing if mouse leaves the window */}

      {/* Panel lock */}
      <Box className={`w-screen h-dvh fixed top-0 left-0 -z-10 
      transition-all duration-300
      bg-gray-950/60 backdrop-blur-sm
      ${drivePageContext.isSidePanelOpen ? 
      'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={closeSidePanel}/> 

      {/* Panel body */}
      <Box className={`h-full 
      overflow-hidden
      grid grid-rows-[1fr_max-content]
      border-r bg-gray-950/60 border-sky-300/20`}
      style={getPanelStyles()}>

        <Box className={`overflow-y-auto
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
        transition-all duration-300
        ${hasLoadedBookmarks ? 'opacity-100' : 'opacity-0'}`}> 

          <Box className='w-full h-8 px-2 flex
          select-none pointer-events-none'>
            <p className='place-self-center'>Places</p>
          </Box>

          <BookmarkElement 
          bookmark={homeBookmark}
          {...getBookmarkProps(homeBookmark)}/>

          <BookmarkElement 
          bookmark={trashBookmark}
          {...getBookmarkProps(trashBookmark)}/>

          <Box className='w-full h-8 px-2 flex
          select-none pointer-events-none'>
            <p className='place-self-center'>Bookmarks</p>
          </Box>

          {bookmarkData.bookmarks.map((bookmark) => (
            <BookmarkElement key={bookmark.uuid} 
            bookmark={bookmark}
            {...getBookmarkProps(bookmark)}/>
          ))}

        </Box>
          
        <Box className='w-full flex p-2
        block md:hidden
        border-t border-sky-300/20 bg-gray-900'>
          <Box className='button-small mr-auto'
          onClick={closeSidePanel}>
            <JournalBookmark className='button-small-icon'/>
            <ChevronLeft className='button-small-icon'/>
          </Box>
        </Box>

      </Box>

    </Box>
  );
}