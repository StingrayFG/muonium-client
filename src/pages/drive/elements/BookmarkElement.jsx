import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/PathSlice';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as House } from 'assets/icons/house.svg'
import { ReactComponent as Trash } from 'assets/icons/trash.svg'


export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);
  const clipboardContext = useContext(ClipboardContext);

  const pathData = useSelector(state => state.path);
  
  const dispatch = useDispatch();


  // HANDLERS
  const handleClick = (event) => {
    if (event.button === 0) {   
      clipboardContext.clearClickedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }

  const handleOnMouseDown = (event) => {
    if (event.button === 0) {   
      clipboardContext.clearClickedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }
  
  const handleOnMouseEnter = () => {
    clipboardContext.setHoveredElement(bookmark);
  }

  const handleOnMouseLeave = () => {
    clipboardContext.setHoveredElement({})
  }

  const handleOnContextMenu = (event) => {
    contextMenuContext.handleBookmarkContextMenuClick(event, bookmark)
  }
  
    
  // STYLES
  const getIcon = () => {
    if (bookmark.folder.uuid === 'home') {
      return <House className='h-5 w-5 mt-[7px]'/>
    } else if (bookmark.folder.uuid === 'trash') {
      return <Trash className='h-5 w-5 mt-[7px]'/>
    } else {
      return <Box className='h-5 w-5 mt-[7px]'/>
    }
  }

  const getIsSelected = () => {
    if ((bookmark.folder.uuid === pathData.currentUuid) && (clipboardContext.clickedElements.length === 0)) {
      return true;
    } else if (clipboardContext.clickedElements.length > 0) {
      if (((clipboardContext.clickedElements[0].type === 'folder') || (clipboardContext.clickedElements[0].type === 'file')) && 
      (bookmark.folder.uuid === pathData.currentUuid)) {
        return true;
      } else {
        return false;
      }     
    } else {
      return false;
    }
  }

  const getIsActive = () => {
    return clipboardContext.clickedElements.includes(bookmark);
  }

  const getButtonStyle = () => {
    if (getIsActive()) {
      return 'button-option-active';
    } else {
      if (getIsSelected()) {
        return 'button-option-selected';
      } else {
        return 'button-option';
      }
    }
  }

  
  // RENDER
  if (bookmark) {
    return (
      <button className={`w-full h-8 px-2 flex 
      ${getButtonStyle()}`}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onContextMenu={handleOnContextMenu}>

        <Box className='shrink-0'>
          {getIcon()}
        </Box>
        

        <p className='ml-2 place-self-center
        text-left text-ellipsis overflow-hidden'>
          { bookmark.folder.name + (bookmark.folder.isRemoved ? ' (in trash)' : '') }
        </p>

      </button>
    );
  } else {
    return null;
  }
}
