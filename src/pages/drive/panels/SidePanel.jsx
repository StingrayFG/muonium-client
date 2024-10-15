import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setSidePanelWidth } from 'state/slices/settingsSlice';

import BookmarkElement from 'pages/drive/elements/BookmarkElement.jsx';
import { useDragHandler } from 'hooks/UseDragHandler';

import config from 'config.json';


export default function SidePanel () {
  const dispatch = useDispatch();

  const bookmarkData = useSelector(state => state.bookmark);
  const settingsData = useSelector(state => state.settings);

  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging] = useDragHandler(0);

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
  }

  const handleOnMouseUp = (event) => {
    stopDragging(event);
    dispatch(setSidePanelWidth(panelWidth));
  } 

  const handleOnMouseMove = (event) => {
    updateDragging(event);
    if (isDragging) {
      if (((settingsData.sidePanelWidth + dragDelta.x) > config.sidePanel.minWidth) && 
      ((windowWidth - (settingsData.sidePanelWidth + dragDelta.x)) > config.contentsPanel.minWidth))
      setPanelWidth(settingsData.sidePanelWidth + dragDelta.x);
    }
  }


  return (
    <Box className={`pr-2 -mr-2 overflow-hidden
    ${isDragging ? 'static' : 'relative'}`}>

      <Box className={`absolute
      cursor-col-resize
      ${isDragging ? 'h-dvh w-screen top-0 left-0' : 'h-full w-4 right-0'}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}
      onMouseLeave={handleOnMouseUp}/> {/* Used to stop resizing if mouse leaves the window */}

      <Box className='h-full overflow-y-auto 
      scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
      bg-black/20 border-r border-sky-300/20' 
      style={{
        width: panelWidth
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