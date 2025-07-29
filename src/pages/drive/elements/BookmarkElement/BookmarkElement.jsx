import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/pathSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as House } from 'assets/icons/house.svg'
import { ReactComponent as Trash } from 'assets/icons/trash.svg'
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg'


export default function BookmarkElement ({ bookmark }) {
  const contextMenuContext = useContext(ContextMenuContext);

  const pathData = useSelector(state => state.path);
  
  const dispatch = useDispatch();


  // HANDLERS
  const handleOnMouseDown = (event) => {
    if (event.button === 0) {   
      contextMenuContext.clearSelectedElements();
      if (!bookmark.folder.isRemoved) { 
        dispatch(moveToNew({ uuid: bookmark.folder.uuid })); 
      }
    }
  }
  
  const handleOnMouseEnter = () => {
    contextMenuContext.setHoveredElement(bookmark);
  }

  const handleOnMouseLeave = () => {
    contextMenuContext.clearHoveredElement();
  }

  const handleOnContextMenu = (event) => {
    contextMenuContext.handleBookmarkContextMenuClick(event, bookmark)
  }
  
    
  // STYLES
  const iconStyle = 'h-5 w-5 mt-[6px]';

  const getIcon = () => {
    if (bookmark.folder.uuid === 'home') {
      return <House className={iconStyle}/>
    } else if (bookmark.folder.uuid === 'trash') {
      return <Trash className={iconStyle}/>
    } else {
      return <Box className={iconStyle}/>
    }
  }

  const getIsSelected = () => {
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
  }

  const getIsActive = () => {
    return contextMenuContext.selectedElements.includes(bookmark);
  }

  const getButtonStyle = () => {
    if (getIsActive()) {
      return 'button-sidebar-active';
    } else {
      if (getIsSelected()) {
        return 'button-sidebar-selected';
      } else {
        return 'button-sidebar';
      }
    }
  }


  // RENDER
  if (bookmark) {
    return (
      <button data-testid='bookmark-element'
      className={`w-full h-8 px-2 flex 
      animate-fadein-custom
      ${getButtonStyle()}`}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onContextMenu={handleOnContextMenu}>

        <Box className='shrink-0'>
          {getIcon()}
        </Box>

        <Box className='ml-2 flex overflow-hidden'>
          {bookmark.folder.isRemoved && <>    
            <Trash className='w-4 h-4 mt-2 mr-1' style={{color: 'rgb(244 63 94)'}}/>
            <ArrowLeft className='w-4 h-4 mt-2 mr-1' style={{color: 'rgb(244 63 94)'}}/>
          </>}

          <p data-testid='bookmark-name'
          className='w-full my-auto
          text-left text-ellipsis overflow-hidden'>
            {bookmark.folder.name }
          </p>
        </Box>


      </button>
    );
  } else {
    return null;
  }
}
