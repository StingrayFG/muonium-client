import { useContext, useState } from 'react';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import TrashFileContextMenu from 'components/drive/main/menu/TrashFileContextMenu.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import TrashFolderContextMenu from 'components/drive/main/menu/TrashFolderContextMenu.jsx';
import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';

export default function FolderPage ({ children }) {
  const folderContext = useContext(FolderContext);

  // Context menu
  const [clicked, setClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState({ uuid: ''});
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuType, setContextMenuType] = useState('default');

  const handleFileContextMenuClick = (event, file) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('file')
    setClickedElement(file);
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleFolderContextMenuClick = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('folder')
    setClickedElement(folder);
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleDefaultContextMenuClick = (event) => {
    event.preventDefault();

    setContextMenuType('default')
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
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

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setClicked(false);
    if (event.target === event.currentTarget) {
      setClickedElement({ uuid: '' })
    }
  };

  return (
    <div className='w-full h-full'
    onClick={handleClick}
    onMouseMove={updatePoint}
    onMouseUp={disableDragging}
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, 
        clickedElement, setClickedElement, 
        hoveredElement, setHoveredElement, requiresMove, setRequiresMove,
        enableDragging, disableDragging, updatePoint,
        renaming, setRenaming, creatingFolder, setCreatingFolder }}> 
        {children}

        {(dragging && ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10))) && 
          <div className='bg-gradient-to-b from-sky-200/45 to-sky-400/45 rounded-md' 
          style={{position: 'absolute', top: containerPoint.y, left: containerPoint.x, width: draggedElementSize.y, height:draggedElementSize.x}}>

          </div>
        }

        {(clicked && !dragging) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={point} setCreatingFolder={setCreatingFolder}/>}
            {(contextMenuType === 'file') && <FileContextMenu point={point} file={clickedElement} setRenaming={setRenaming}/>}
            {(contextMenuType === 'folder') && <FolderContextMenu point={point} folder={clickedElement} setRenaming={setRenaming}/>}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {(contextMenuType === 'file') && <TrashFileContextMenu point={point} file={clickedElement} />}
            {(contextMenuType === 'folder') && <TrashFolderContextMenu point={point} folder={clickedElement} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}