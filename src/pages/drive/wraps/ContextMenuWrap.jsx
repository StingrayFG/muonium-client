import { useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { copyToClipboard, cutToClipboard, clearClipboard } from 'state/slices/clipboardSlice.jsx';
import { copyElements, pasteElements, moveElements, removeElements, recoverElements, deleteElements } from 'state/slices/currentFolderSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';
import { DropzoneContext } from 'contexts/DropzoneContext';

import FileService from 'services/FileService.jsx';

import DefaultContextMenu from 'pages/drive/menus/DefaultContextMenu.jsx';
import FileContextMenu from 'pages/drive/menus/FileContextMenu.jsx';
import FolderContextMenu from 'pages/drive/menus/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'pages/drive/menus/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'pages/drive/menus/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'pages/drive/menus/BookmarkContextMenu.jsx';
import TrashContextMenu from 'pages/drive/menus/TrashContextMenu.jsx';


export default function ContextMenuWrap ({ children }) {
  const dispatch = useDispatch();

  const dropzoneContext = useContext(DropzoneContext);
  
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);


  const [clickedElements, setClickedElements] = useState([]);
  const [hoveredElement, setHoveredElement] = useState({ uuid: '' });


  // SELECTION
  const addClickedElement = (event, element) => {
    if (event.ctrlKey) {
      if (!clickedElements.includes(element)) {
        setClickedElements(clickedElements => [...clickedElements, element]);
      }   
    } else {
      setClickedElements([element]);
    }
  }

  const clearClickedElements = () => {
    setClickedElements([]);
  }

  // UPLOAD
  const openUpload = async () => {
    dropzoneContext.open();
    setIsContextMenu(false);
  }
  
  // DOWNLOAD
  const downloadClickedElements = async () => {
    setIsContextMenu(false);

    for await (const element of clickedElements) {
      await FileService.handleDownload(userData, driveData, element);
    }
  }

  // NAMING
  const [isRenaming, setIsRenaming] = useState(false); // Changed by context menus, changes are read in the elements
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    setIsContextMenu(false);
  }, [isRenaming, isCreatingFolder])

  // CLIPBOARD
  const copyClickedElements = () => {
    setIsContextMenu(false);
    dispatch(copyToClipboard({ originUuid: currentFolderData.uuid, elements: clickedElements }));
  };

  const cutClickedElements = () => {
    setIsContextMenu(false);
    dispatch(cutToClipboard({ originUuid: currentFolderData.uuid, elements: clickedElements }));
  };

  const pasteClickedElements = async () => {
    setIsContextMenu(false);
    dispatch(clearClipboard());

    if (clipboardData.mode === 'copy') {
      dispatch(copyElements({ 
        userData, 
        driveData, 
        elements: clipboardData.elements.map(element => ({ ...element, parentUuid: currentFolderData.uuid })) // Change parentUuid to the target uuid
      }))
    } else if (clipboardData.mode === 'cut') {
      dispatch(pasteElements({ 
        userData, 
        driveData, 
        elements:  clipboardData.elements.map(element => ({ ...element, parentUuid: currentFolderData.uuid }))
      }));
    }
  };

  const moveClickedElements = async () => { // Used to move by dragging elements
    dispatch(moveElements({ 
      userData, 
      driveData, 
      elements: clickedElements.map(element => ({ ...element, parentUuid: hoveredElement.uuid }))
    }))
  }

  // TRASH
  const removeClickedElements = async () => {
    setIsContextMenu(false);
    dispatch(removeElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))
  }

  const recoverClickedElements = async () => {
    setIsContextMenu(false);
    dispatch(recoverElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))
  }

  const deleteClickedElements = async () => {
    setIsContextMenu(false);
    dispatch(deleteElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))
  }


  // MENUS HANDLERS
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [isHoveredOverMenu, setIsHoveredOverMenu] = useState(false);

  const [contextMenuType, setContextMenuType] = useState('default');
  const [contextMenuClickPosition, setContextMenuClickPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isContextMenu && !isHoveredOverMenu) {
      setIsContextMenu(false);   
    } else if (!isContextMenu) {
      setContextMenuClickPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setIsContextMenu(true);
    }
  };

  const handleFileContextMenuClick = (event, file) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      if (clickedElements.length <= 1) {
        addClickedElement(event, file);
        setContextMenuType('file')
      } else {
        // Will replace the clickedElements if ctrl key is not pressed and 
        // the newly clicked element is not already in the clickedElements, otherwise nothing will happen
        if (!clickedElements.includes(file)) { 
          addClickedElement(event, file); 
        }
        if (clickedElements.map(element => element.type).includes('folder')) {
          setContextMenuType('folder-multiple')
        } else {
          setContextMenuType('file-multiple')
        }
      }
    }
  };

  const handleFolderContextMenuClick = (event, folder) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      if (clickedElements.length <= 1) {
        addClickedElement(event, folder);
        setContextMenuType('folder');
      } else {
        // Will replace the clickedElements if ctrl key is not pressed and 
        // the newly clicked element is not already in the clickedElements, otherwise nothing will happen
        if (!clickedElements.includes(folder)) { 
          addClickedElement(event, folder); 
        }
        setContextMenuType('folder-multiple');
      }
    }
  };

  const handleDefaultContextMenuClick = (event) => {
    handleContextMenuClick(event);

    if (!isContextMenu) {
      clearClickedElements();
      setContextMenuType('default');
    }
  };

  const handleBookmarkContextMenuClick = (event, bookmark) => {
    if (!['home', 'trash'].includes(bookmark.folder.uuid)) {
      handleContextMenuClick(event);
      if (!isContextMenu) {
        addClickedElement(event, bookmark);
        setContextMenuType('bookmark'); 
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };


  // DRAGGING
  const [draggedElementSize, setDraggedElementSize] = useState({ x: 0, y: 0 });
  const [isHoldingElement, setIsHoldingElement] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);

  const [mousePointInitial, setMousePointInitial] = useState({ x: 0, y: 0 });
  const [containerPoint, setContainerPoint] = useState({ x: 0, y: 0 });

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const clearHoveredElement = () => {
    setHoveredElement({ uuid: '' });
  }

  const updateDragging = (event) => {
    if ((Math.pow(containerPoint.x - mousePointInitial.x, 2) + (Math.pow(containerPoint.y - mousePointInitial.y, 2) > 10)) 
    && !isDraggingElement && isHoldingElement) {
      setIsDraggingElement(true);
    }
    if (isHoldingElement) {
      const movementDelta = { x: event.clientX - mousePointInitial.x, y: event.clientY - mousePointInitial.y }
      let newContainerPoint = {};

      if ((mousePointInitial.x + movementDelta.x + draggedElementSize.x) >= windowWidth) { // Prevent overflow on the right
        newContainerPoint.x = windowWidth - draggedElementSize.y;
      } else if ((mousePointInitial.x + movementDelta.x) < 0) { // Prevent overflow on the left
        newContainerPoint.x = 0;
      } else {
        newContainerPoint.x = event.clientX;
      }

      if ((mousePointInitial.y + movementDelta.y + draggedElementSize.y) >= windowHeight) { // Prevent overflow on the bottom
        newContainerPoint.y = windowHeight - draggedElementSize.x;
      } else if ((mousePointInitial.y + movementDelta.y) < 0) { // Prevent overflow on the top
        newContainerPoint.y = 0;
      } else {
        newContainerPoint.y = event.clientY;
      }

      setContainerPoint({ x: newContainerPoint.x, y: newContainerPoint.y });
    }
  }

  const startDraggingElement = (event) => {
    setIsHoldingElement(true);
    setDraggedElementSize({ x: event.target.offsetWidth, y: event.target.offsetWidth });

    setMousePointInitial({ x: event.pageX, y: event.pageY });
    setContainerPoint({ x: event.pageX, y: event.pageY });
  }

  const stopDraggingElement = () => {
    setIsDraggingElement(false);
    setIsHoldingElement(false);
    if (hoveredElement.uuid && (!clickedElements.includes(hoveredElement)) && (hoveredElement.type === 'folder') && 
    isDraggingElement && !isRenaming && !isCreatingFolder) {
      moveClickedElements();
    }
  }


  // EVENTS HANDLERS
  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      clearClickedElements();
      dispatch(clearClipboard());
    }
  }

  const handleOnMouseUp = (event) => {
    event.preventDefault();

    if (event.button === 0) {
      stopDraggingElement()
    }
  };

  const handleOnWrapMouseDown = (event) => {
    if (event.button === 0) {
      if (!hoveredElement.uuid && !isContextMenu && !event.ctrlKey) { // Deselect elements if context menu is not open
        clearClickedElements();  
      }

      if (isContextMenu && !isHoveredOverMenu) { // LMB only, the RMB clicks are handled in handleContextMenuClick()
        setIsContextMenu(false);   
      } 

      if (hoveredElement.uuid) { // Get ready for dragging
        startDraggingElement(event);
      }
    }
  };

  const handleOnElementMouseDown = (event, element) => {
    if (!isContextMenu && (event.button === 0)) {
      addClickedElement(event, element); // Will get added or appended depending on the ctrl key
    }
  };

  const handleOnMouseMove = (event) => {
    updateDragging(event);
  }
  

  // RENDER 
  const getMenu = () => {
    if (!isDraggingElement) {
      if (currentFolderData.uuid !== 'trash') {
        if (contextMenuType === 'default') { return <DefaultContextMenu /> }
        else if (contextMenuType === 'file') { return <FileContextMenu /> } 
        else if (contextMenuType === 'folder') { return <FolderContextMenu folder={clickedElements[0]} /> }  
        else if (contextMenuType === 'file-multiple') { return <MultipleFileContextMenu /> }
        else if (contextMenuType === 'folder-multiple') { return <MultipleFolderContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clickedElements[0]} /> }  
      } else if (currentFolderData.uuid === 'trash') {
        if (['file', 'folder', 'file-multiple', 'folder-multiple'].includes(contextMenuType)) { return <TrashContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clickedElements[0]} /> }  
      }
    }
  }

  return (
    <Box className='w-full h-full grid grid-cols-[max-content_1fr] overflow-hidden'
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseDown={handleOnWrapMouseDown}
    onMouseMove={handleOnMouseMove}
    onContextMenu={handleDefaultContextMenuClick}>

      <ContextMenuContext.Provider value={{ 
      downloadClickedElements, openUpload,
      clickedElements, addClickedElement, clearClickedElements,  
      removeClickedElements, recoverClickedElements, deleteClickedElements,
      copyClickedElements, cutClickedElements, pasteClickedElements, 
      hoveredElement, setHoveredElement, clearHoveredElement,
      isRenaming, setIsRenaming, isCreatingFolder, setIsCreatingFolder,
      handleOnElementMouseDown,
      isContextMenu, setIsContextMenu, 
      contextMenuClickPosition,
      isHoveredOverMenu, setIsHoveredOverMenu,
      handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick
       }}> 

        {isDraggingElement && 
          <Box className='bg-sky-400/20 rounded-[0.3rem]' 
          style={{ 
            position: 'absolute', 
            top: containerPoint.y, 
            left: containerPoint.x, 
            width: draggedElementSize.y, 
            height: draggedElementSize.x 
          }}>
          </Box>
        }

        { children }  

        { getMenu() }

      </ContextMenuContext.Provider> 

    </Box>
  );
}