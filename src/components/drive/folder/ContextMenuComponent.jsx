import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CutCopyPasteContext } from 'components/drive/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/context/FolderContext.jsx';

import DefaultContextMenu from 'components/drive/menu/DefaultContextMenu.jsx';
import FileContextMenu from 'components/drive/menu/FileContextMenu.jsx';
import FolderContextMenu from 'components/drive/menu/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'components/drive/menu/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'components/drive/menu/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'components/drive/menu/BookmarkContextMenu.jsx';
import TrashContextMenu from 'components/drive/menu/TrashContextMenu.jsx';

export default function ContextMenuComponent ({ children }) {
  const folderContext = useContext(FolderContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);

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

    if (cutCopyPasteContext.clickedElements.length < 2) {
      cutCopyPasteContext.addClickedElement(event, file);
      setContextMenuType('file')
    } else {
      if (cutCopyPasteContext.clickedElements.map(e => e.type).includes('folder')) {
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

    if (cutCopyPasteContext.clickedElements.length < 2) {
      cutCopyPasteContext.addClickedElement(event, folder);
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

    cutCopyPasteContext.clearClickedElements();

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

    cutCopyPasteContext.addClickedElement(event, bookmark);

    setContextMenuType('bookmark')
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };
  
  useEffect(() => {
    if (cutCopyPasteContext.doesRequireMenuClosure) {
      setIsContextMenu(false);
      setIsHoveredOverMenu(false);
      cutCopyPasteContext.setDoesRequireMenuClosure(false);
    }
  })

  const handleMouseUp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    cutCopyPasteContext.handleMouseUp(event);
    
    if (event.button === 0) {
      if (((isContextMenu && !isHoveredOverMenu && !cutCopyPasteContext.hoveredElement.uuid)) || 
      (!cutCopyPasteContext.hoveredElement.uuid && !isHoveredOverMenu && !cutCopyPasteContext.isDraggingElement)) {
        cutCopyPasteContext.clearClickedElements();  
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
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
        isHoveredOverMenu, setIsHoveredOverMenu }}> 
        {children}  

        {(isContextMenu && !cutCopyPasteContext.isDraggingElement) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'file') && <FileContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'folder') && <FolderContextMenu point={contextMenuPoint} folder={cutCopyPasteContext.clickedElements[0]} />}  
            {(contextMenuType === 'file_multiple') && <MultipleFileContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'folder_multiple') && <MultipleFolderContextMenu point={contextMenuPoint} />}
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={cutCopyPasteContext.clickedElements[0]} />}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {((contextMenuType === 'file') || (contextMenuType === 'folder') || 
            (contextMenuType === 'file_multiple') || (contextMenuType === 'folder_multiple')) && <TrashContextMenu point={contextMenuPoint}/>}
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={cutCopyPasteContext.clickedElements[0]} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}