import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import TrashFileContextMenu from 'components/drive/main/menu/TrashFileContextMenu.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import TrashFolderContextMenu from 'components/drive/main/menu/TrashFolderContextMenu.jsx';
import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';
import BookmarkContextMenu from 'components/drive/main/menu/BookmarkContextMenu.jsx';

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

    setContextMenuType('file')
    cutCopyPasteContext.setClickedElement(file);
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleFolderContextMenuClick = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('folder')
    cutCopyPasteContext.setClickedElement(folder);
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleDefaultContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('default')
    cutCopyPasteContext.setClickedElement({ uuid: '' });
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleBookmarkContextMenuClick = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('bookmark')
    cutCopyPasteContext.setClickedElement(folder);
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };
  
  useEffect(() => {
    if (cutCopyPasteContext.requiresContextMenuClosure) {
      setIsContextMenu(false);
    }
  })

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === 0) {
      if ((!cutCopyPasteContext.hoveredElement.uuid && !isContextMenu) || (!hoveredOverMenu && isContextMenu)) {
        cutCopyPasteContext.setClickedElement({ uuid: '' })
      }
      setIsContextMenu(false);
    }
  };

  // Rename
  const [renaming, setRenaming] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  return (
    <div className='w-full h-full grid grid-cols-[max-content_1fr] overflow-hidden'
    onClick={handleClick}
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
        hoveredOverMenu, setHoveredOverMenu,
        renaming, setRenaming, creatingFolder, setCreatingFolder}}> 
        {children}  

        {(isContextMenu && !cutCopyPasteContext.draggingElement) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={contextMenuPoint} setCreatingFolder={setCreatingFolder} />}
            {(contextMenuType === 'file') && <FileContextMenu point={contextMenuPoint} file={cutCopyPasteContext.clickedElement} setRenaming={setRenaming} />}
            {(contextMenuType === 'folder') && <FolderContextMenu point={contextMenuPoint} folder={cutCopyPasteContext.clickedElement} setRenaming={setRenaming} />}  
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={cutCopyPasteContext.clickedElement} />}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {(contextMenuType === 'file') && <TrashFileContextMenu point={contextMenuPoint} file={cutCopyPasteContext.clickedElement} />}
            {(contextMenuType === 'folder') && <TrashFolderContextMenu point={contextMenuPoint} folder={cutCopyPasteContext.clickedElement} />}  
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={cutCopyPasteContext.clickedElement} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}