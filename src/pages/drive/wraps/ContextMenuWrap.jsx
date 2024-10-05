import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

import DefaultContextMenu from 'pages/drive/menus/DefaultContextMenu.jsx';
import FileContextMenu from 'pages/drive/menus/FileContextMenu.jsx';
import FolderContextMenu from 'pages/drive/menus/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'pages/drive/menus/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'pages/drive/menus/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'pages/drive/menus/BookmarkContextMenu.jsx';
import TrashContextMenu from 'pages/drive/menus/TrashContextMenu.jsx';

export default function ContextMenuWrap ({ children }) {
  const folderContext = useContext(FolderContext);
  const clipboardContext = useContext(ClipboardContext);

  const [isContextMenu, setIsContextMenu] = useState(false);
  const [isHoveredOverMenu, setIsHoveredOverMenu] = useState(false);

  const [contextMenuType, setContextMenuType] = useState('default');
  const [contextMenuClickPosition, setContextMenuClickPosition] = useState({
    x: 0,
    y: 0,
  });


  //
  useEffect(() => {
    if (clipboardContext.shallContextMenuClose) {
      setIsContextMenu(false);
      setIsHoveredOverMenu(false);
      clipboardContext.setShallContextMenuClose(false);
    }
  })


  // MENUS
  const handleContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isContextMenu && !isHoveredOverMenu) {
      setIsContextMenu(false);   
    } else if (!isContextMenu) {
      setContextMenuClickPosition({
        x: event.pageX,
        y: event.pageY,
      });
      setIsContextMenu(true);
    }
  };

  const handleFileContextMenuClick = (event, file) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      if (clipboardContext.clickedElements.length < 2) {
        clipboardContext.addClickedElement(event, file);
        setContextMenuType('file')
      } else {
        if (clipboardContext.clickedElements.map(e => e.type).includes('folder')) {
          setContextMenuType('folder_multiple')
        } else {
          setContextMenuType('file_multiple')
        }
      }
    }
  };

  const handleFolderContextMenuClick = (event, folder) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      if (clipboardContext.clickedElements.length < 2) {
        clipboardContext.addClickedElement(event, folder);
        setContextMenuType('folder');
      } else {
        setContextMenuType('folder_multiple');
      }
    }
  };

  const handleDefaultContextMenuClick = (event) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      clipboardContext.clearClickedElements();
      setContextMenuType('default');
    }
  };

  const handleBookmarkContextMenuClick = (event, bookmark) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      clipboardContext.addClickedElement(event, bookmark);
      setContextMenuType('bookmark');
    }
  };


  //
  const getMenu = () => {
    if (!clipboardContext.isDraggingElement) {
      if (folderContext.currentFolder.uuid !== 'trash') {
        if (contextMenuType === 'default') { return <DefaultContextMenu /> }
        else if (contextMenuType === 'file') { return <FileContextMenu /> } 
        else if (contextMenuType === 'folder') { return <FolderContextMenu folder={clipboardContext.clickedElements[0]} /> }  
        else if (contextMenuType === 'file_multiple') { return <MultipleFileContextMenu /> }
        else if (contextMenuType === 'folder_multiple') { return <MultipleFolderContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clipboardContext.clickedElements[0]} /> }  
      } else if (folderContext.currentFolder.uuid  === 'trash') {
        if (['file', 'folder', 'file_multiple', 'folder_multiple'].includes(contextMenuType)) { return <TrashContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clipboardContext.clickedElements[0]} /> }  
      }
    }
  }


  // MOUSE
  const handleMouseUp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clipboardContext.handleMouseUp(event); //?
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      if (!clipboardContext.hoveredElement.uuid && !isContextMenu) {
        clipboardContext.clearClickedElements();  
      }

      if (isContextMenu && !isHoveredOverMenu) { // LMB only, the RMB clicks are handled in handleContextMenuClick()
        setIsContextMenu(false);   
      } 
    }
  };


  // RENDER
  return (
    <Box className='w-full h-full flex'
    onMouseUp={handleMouseUp}
    onMouseDown={handleMouseDown}
    onContextMenu={handleDefaultContextMenuClick}>

      <ContextMenuContext.Provider value={{ isContextMenu, contextMenuClickPosition,
      handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
      isHoveredOverMenu, setIsHoveredOverMenu }}> 

        { children }  

        { getMenu() }

      </ContextMenuContext.Provider> 

    </Box>
  );
}