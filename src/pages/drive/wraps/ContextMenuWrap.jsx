import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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

  // Context menu
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [isHoveredOverMenu, setIsHoveredOverMenu] = useState(false);

  const [contextMenuType, setContextMenuType] = useState('default');
  const [contextMenuPoint, setContextMenuPoint] = useState({
    x: 0,
    y: 0,
  });

  const handleFileContextMenuClick = (event, file) => {
    event.preventDefault();
    event.stopPropagation();

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

    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleFolderContextMenuClick = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    if (clipboardContext.clickedElements.length < 2) {
      clipboardContext.addClickedElement(event, folder);
      setContextMenuType('folder');
    } else {
      setContextMenuType('folder_multiple');
    }

    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleDefaultContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    clipboardContext.clearClickedElements();

    setContextMenuType('default')
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleBookmarkContextMenuClick = (event, bookmark) => {
    event.preventDefault();
    event.stopPropagation();

    clipboardContext.addClickedElement(event, bookmark);

    setContextMenuType('bookmark')
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };
  
  useEffect(() => {
    if (clipboardContext.doesRequireMenuClosure) {
      setIsContextMenu(false);
      setIsHoveredOverMenu(false);
      clipboardContext.setDoesRequireMenuClosure(false);
    }
  })

  const handleMouseUp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clipboardContext.handleMouseUp(event);
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      if ((isContextMenu && !isHoveredOverMenu && !clipboardContext.hoveredElement.uuid) || 
      (!clipboardContext.isDraggingElement && !isHoveredOverMenu && !clipboardContext.hoveredElement.uuid)) {
        clipboardContext.clearClickedElements();  
      }

      if (isContextMenu && !isHoveredOverMenu) {
        setIsContextMenu(false);   
      }
    }
  };

  // Rename
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const customSetRenaming = (v) => {
    setIsRenaming(v);
    setIsContextMenu(false); 
  }

  const customSetCreatingFolder = (v) => {
    setIsCreatingFolder(v);
    setIsContextMenu(false); 
  }

  return (
    <div className='w-full h-full flex'
    onMouseUp={handleMouseUp}
    onMouseDown={handleMouseDown}
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
        isHoveredOverMenu, setIsHoveredOverMenu }}> 
        {children}  

        {(isContextMenu && !clipboardContext.isDraggingElement) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'file') && <FileContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'folder') && <FolderContextMenu point={contextMenuPoint} folder={clipboardContext.clickedElements[0]} />}  
            {(contextMenuType === 'file_multiple') && <MultipleFileContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'folder_multiple') && <MultipleFolderContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={clipboardContext.clickedElements[0]} />}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {((contextMenuType === 'file') || (contextMenuType === 'folder') || 
            (contextMenuType === 'file_multiple') || (contextMenuType === 'folder_multiple')) && <TrashContextMenu point={contextMenuPoint}/>}
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={clipboardContext.clickedElements[0]} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}