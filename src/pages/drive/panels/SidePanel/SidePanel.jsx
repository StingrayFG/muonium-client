import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { useDragHandler } from 'hooks/UseDragHandler';

import { setSidePanelWidth, setSidePanelIsEnabled } from 'state/slices/settingsSlice';
import { getBookmarks } from 'state/slices/bookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { DrivePageContext } from 'contexts/DrivePageContext';

import BookmarkElement from 'pages/drive/elements/BookmarkElement/BookmarkElement.jsx';

import { ReactComponent as ChevronBarLeft } from 'assets/icons/chevron-bar-left.svg'
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg'
import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as JournalBookmark } from 'assets/icons/journal-bookmark.svg'

import config from 'config.json';


export default function SidePanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);
  const drivePageContext = useContext(DrivePageContext);

  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);
  const settingsData = useSelector(state => state.settings);
  const pathData = useSelector(state => state.pathData);

  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging, updateDelta] = useDragHandler(0);

  const [panelWidth, setPanelWidth] = useState(settingsData.sidePanelWidth);

  // UPDATE
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  useEffect(() => {
    if (userData) {
      dispatch(getBookmarks(userData))
      .then(() => { setHasLoadedInitially(true) })
      .catch(() => { setHasLoadedInitially(true) })
    }
  }, [])


  // CONFIG
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])

  const getIsOnMobile = () => {
    return (windowWidth < 768)
  }
  
  useEffect(() => {
    if (((windowWidth - panelWidth) < config.contentsPanel.minWidth) && !getIsOnMobile()) {
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

  const closeSidePanel = () => {
    drivePageContext.closeSidePanel()
  }


  // ELEMENT FUNCTIONS
  const getIsSelected = (bookmark) => {
    if (pathData) {
      if ((bookmark.folder.uuid === pathData.currentUuid) && (contextMenuContext.selectedElements.length === 0)) {
        return true;
      } else if (contextMenuContext.selectedElements.length > 0) {
        if (((contextMenuContext.selectedElements[0].type === 'folder') || (contextMenuContext.selectedElements[0].type === 'file')) && 
        (bookmark.folder.uuid === pathData.currentUuid)) {
          return true;
        } else {
          return false;
        }     
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const getWrapStyles = () => {
    let res = ''
    if (getIsOnMobile()) {
      res = `w-[80vw] 
      fixed top-0
      transition-all duration-300`
      if (drivePageContext.isSidePanelOpen) {
        res += ' left-0'
      } else {
        res += ' left-[-80vw]'
      }
    } else {
      res = 'relative transition-opacity duration-300'
    }
    return res;
  }

  const getPanelStyles = () => {
    if (!getIsOnMobile()) {
      return { width: panelWidth + 'px' };
    } else {
      return {};
    }
  }


  // RENDER
  return (
    <Box className={`h-full pr-2 -mr-2 z-20
    overflow-hidden
    shrink-0  
    ${getWrapStyles()}`}
    onContextMenu={contextMenuContext.handleSidePanelContextMenuClick}
    onMouseDown={contextMenuContext.handleOnWrapMouseDown}>

      <Box className={`z-10
      pointer-events-none md:pointer-events-auto
      cursor-col-resize
      ${isDragging ? 'fixed h-dvh w-screen top-0 left-0' : 'absolute h-full w-4 right-0'}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}/> {/* Used to stop resizing if mouse leaves the window */}

      <Box className={`w-screen h-dvh fixed top-0 left-0 -z-10 
      transition-all duration-300
      bg-gray-950/60 backdrop-blur-sm
      ${drivePageContext.isSidePanelOpen ? 
      'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={closeSidePanel}/> 

      <Box className={`w-full h-full 
      overflow-hidden
      grid grid-rows-[1fr_max-content]
      border-r bg-gray-950/60 border-sky-300/20
      ${isHolding ? 'duration-0' : 'duration-300'}`}
      style={getPanelStyles()}>


        <Box className={`overflow-y-auto
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
        transition-all duration-300
        ${hasLoadedInitially ? 'opacity-100' : 'opacity-0'}`}> 

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
            <BookmarkElement key={bookmark.uuid} 
            bookmark={bookmark}
            isActive={contextMenuContext.selectedElements.includes(bookmark)}
            isSelected={getIsSelected(bookmark)}/>
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