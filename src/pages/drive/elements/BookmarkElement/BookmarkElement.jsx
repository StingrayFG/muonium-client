import React, { useContext } from 'react';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as Trash } from 'assets/icons/trash.svg'
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg'


export default function BookmarkElement ({ 
  bookmark, 
  generatedIcon, 
  isSelected,
  handleOnBookmarkMouseDown
 }) {

  const contextMenuContext = useContext(ContextMenuContext);

  // HANDLERS
  const handleOnMouseDown = (event) => {
    handleOnBookmarkMouseDown(event, bookmark)
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

  // RENDER
  if (bookmark) {
    return (
      <Box data-testid='bookmark-element'
      className={`w-full h-8 px-2 flex 
      animate-fadein-custom
      ${isSelected ? 'button-sidebar-selected' : 'button-sidebar'}`}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onContextMenu={handleOnContextMenu}>

        <Box className='shrink-0'>
          {generatedIcon}
        </Box>

        <Box className='ml-2 flex overflow-hidden'>
          {bookmark.folder.isRemoved && <>    
            <Trash className='w-4 h-4 mt-2 mr-1' style={{color: 'rgb(244 63 94)'}}/>
            <ArrowLeft className='w-4 h-4 mt-2 mr-1' style={{color: 'rgb(244 63 94)'}}/>
          </>}

          <p data-testid='bookmark-name'
          className='w-full my-auto
          text-left text-ellipsis overflow-hidden'>
            {bookmark.folder.name}
          </p>
        </Box>

      </Box>
    );
  } else {
    return null;
  }
}
