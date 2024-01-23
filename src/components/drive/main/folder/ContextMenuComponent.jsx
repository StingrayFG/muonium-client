import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';
import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'components/drive/main/menu/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'components/drive/main/menu/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'components/drive/main/menu/BookmarkContextMenu.jsx';
import TrashContextMenu from 'components/drive/main/menu/TrashContextMenu.jsx';

export default function ContextMenuComponent ({ children }) {
  const folderContext = useContext(FolderContext);
  const cutCopyPasteContext = useContext(CutCopyPasteContext);

  // Context menu
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [hoveredOverMenu, setHoveredOverMenu] = useState(false);
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
    if (cutCopyPasteContext.requiresContextMenuClosure) {
      setIsContextMenu(false);
      cutCopyPasteContext.setRequiresContextMenuClosure(false);
    }
  })

  const handleMouseUp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    cutCopyPasteContext.handleMouseLeave(event);
    
    if (event.button === 0) {
      if (((isContextMenu && !hoveredOverMenu && !cutCopyPasteContext.hoveredElement.uuid)) || 
      (!cutCopyPasteContext.hoveredElement.uuid && !hoveredOverMenu && !cutCopyPasteContext.draggingElement)) {
        cutCopyPasteContext.clearClickedElements();  
      }

      if (isContextMenu && !hoveredOverMenu) {
        setIsContextMenu(false);   
      }
    }
  };

  // Rename
  const [renaming, setRenaming] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const customSetRenaming = (v) => {
    setRenaming(v);
    setIsContextMenu(false); 
  }

  const customSetCreatingFolder = (v) => {
    setCreatingFolder(v);
    setIsContextMenu(false); 
  }

  return (
    <div className='w-full h-full flex'
    onMouseUp={handleMouseUp}
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
        hoveredOverMenu, setHoveredOverMenu,
        renaming, setRenaming: customSetRenaming, creatingFolder, setCreatingFolder: customSetCreatingFolder, setCreatingFolder}}> 
        {children}  

        {(isContextMenu && !cutCopyPasteContext.draggingElement) && <>
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