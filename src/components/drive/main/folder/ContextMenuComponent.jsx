import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCopy, setCut, setPaste } from 'services/slice/ClipboardSlice.jsx';
import { requestUpdate } from 'services/slice/PathSlice';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileService from 'services/FileService.jsx';
import FolderService from 'services/FolderService.jsx';

import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import TrashFileContextMenu from 'components/drive/main/menu/TrashFileContextMenu.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import TrashFolderContextMenu from 'components/drive/main/menu/TrashFolderContextMenu.jsx';
import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';
import BookmarkContextMenu from 'components/drive/main/menu/BookmarkContextMenu.jsx';

export default function ContextMenuComponent ({ children }) {
  const folderContext = useContext(FolderContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);

  // Context menu
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [clickedElement, setClickedElement] = useState({ uuid: '' });
  const [contextMenuPoint, setContextMenuPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuType, setContextMenuType] = useState('default');

  useEffect(() => {
    if (folderContext.requiresContextReset) {
      folderContext.setRequiresContextReset(false);
      setClickedElement({ uuid: ''});
    }
  })

  const handleFileContextMenuClick = (event, file) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('file')
    setClickedElement(file);
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
    setClickedElement(folder);
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
    setClickedElement({ uuid: '' });
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
    setClickedElement(folder);
    setIsContextMenu(true);
    setContextMenuPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const [hoveredOverMenu, setHoveredOverMenu] = useState(false);
  
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === 0) {
      if ((!hoveredElement.uuid && !isContextMenu) || (!hoveredOverMenu && isContextMenu)) {
        setClickedElement({ uuid: '' })
      }
      setIsContextMenu(false);
    }
  };

  // Rename
  const [renaming, setRenaming] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Move
  const [dragging, setDragging] = useState(false);
  const [draggedElementSize, setDraggedElementSize] = useState(false);

  const [hoveredElement, setHoveredElement] = useState({ uuid: ' '});
  const [requiresMove, setRequiresMove] = useState(false);

  const [mousePointInitial, setMousePointInitial] = useState({ x: 0, y: 0 });
  const [containerPoint, setContainerPoint] = useState({ x: 0, y: 0 });
  const [containerPointInitial, setContainerPointInitial] = useState({ x: 0, y: 0 });

  const updatePoint = (event) => {
    if (dragging) {
      setContainerPoint({
        x: containerPointInitial.x + (event.pageX - mousePointInitial.x),
        y: containerPointInitial.y + (event.pageY - mousePointInitial.y),
      });
    }
  }

  const enableDragging = (event, element) => {
    if (event.button === 0) {
      setDragging(true);
      setDraggedElementSize({ x: event.currentTarget.offsetHeight, y: event.currentTarget.offsetWidth })
      setClickedElement(element);
  
      setMousePointInitial({ x: event.pageX, y: event.pageY });
      setContainerPointInitial({ x: event.pageX, y: event.pageY });
      setContainerPoint({ x: event.pageX, y: event.pageY });
    }
  }

  const disableDragging = (event) => {
    if (event.button === 0) {
      setDragging(false);
      if (hoveredElement.uuid && (hoveredElement.uuid !== clickedElement.uuid) && 
      ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10))) {
        setRequiresMove(true);
      }
    }
  }

  const handleCopy = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsContextMenu(false);

    dispatch(setCopy({ originUuid: folderContext.currentFolder.uuid, elements: [clickedElement] }));
  };

  const handleCut = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsContextMenu(false);

    console.log(clickedElement)
    dispatch(setCut({ originUuid: folderContext.currentFolder.uuid, elements: [clickedElement] }));
  };
  
  const handlePaste = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsContextMenu(false);

    if (clipboardData.mode === 'copy') {
      if (clipboardData.elements[0].type === 'file') {
        FileService.handleCopy(userData, folderContext.currentFolder.uuid, clipboardData.elements[0])
        .then(() => { dispatch(requestUpdate()); })
      }
    } else if (clipboardData.mode === 'cut') {
      if (clipboardData.elements[0].type === 'file') { 
        FileService.handleMove(userData, folderContext.currentFolder.uuid, clipboardData.elements[0])
        .then(() => { dispatch(requestUpdate()); })
      } else if (clipboardData.elements[0].type === 'folder') { 
        FolderService.handleMove(userData, folderContext.currentFolder.uuid, clipboardData.elements[0])
        .then(() => { dispatch(requestUpdate()); })
      }
    }

    dispatch(setPaste());
  };
  

  return (
    <div className='w-full h-full grid grid-cols-[max-content_1fr] overflow-hidden'
    onClick={handleClick}
    onMouseMove={updatePoint}
    onMouseUp={disableDragging}
    onContextMenu={handleDefaultContextMenuClick}

    onCopy={handleCopy}
    onCut={handleCut}
    onPaste={handlePaste}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick,
        clickedElement, setClickedElement, 
        hoveredElement, setHoveredElement, requiresMove, setRequiresMove,
        hoveredOverMenu, setHoveredOverMenu,
        enableDragging, disableDragging, updatePoint,
        renaming, setRenaming, creatingFolder, setCreatingFolder,
        handleCopy, handleCut, handlePaste}}> 
        {children}

        {(dragging && ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10))) && 
          <div className='bg-gradient-to-b from-sky-200/45 to-sky-400/45 rounded-md' 
          style={{position: 'absolute', top: containerPoint.y, left: containerPoint.x, width: draggedElementSize.y, height:draggedElementSize.x}}>

          </div>
        }

        {(isContextMenu && !dragging) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={contextMenuPoint} setCreatingFolder={setCreatingFolder} />}
            {(contextMenuType === 'file') && <FileContextMenu point={contextMenuPoint} file={clickedElement} setRenaming={setRenaming} />}
            {(contextMenuType === 'folder') && <FolderContextMenu point={contextMenuPoint} folder={clickedElement} setRenaming={setRenaming} />}  
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint} bookmark={clickedElement} />}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {(contextMenuType === 'file') && <TrashFileContextMenu point={contextMenuPoint}  file={clickedElement} />}
            {(contextMenuType === 'folder') && <TrashFolderContextMenu point={contextMenuPoint}  folder={clickedElement} />}  
            {(contextMenuType === 'bookmark') && <BookmarkContextMenu point={contextMenuPoint}  bookmark={clickedElement} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}