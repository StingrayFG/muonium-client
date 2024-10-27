import { useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { copyToClipboard, cutToClipboard, clearClipboard } from 'state/slices/clipboardSlice.jsx';
import { copyElements, pasteElements, moveElements, removeElements, recoverElements, deleteElements } from 'state/slices/currentFolderSlice';
import { addBookmarksOnClient, updateBookmarksOnClient, revertUpdateBookmarksOnClient, deleteBookmarksOnClient } from 'state/slices/bookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { DropzoneContext } from 'contexts/DropzoneContext';

import FileService from 'services/FileService.jsx';

import DefaultContextMenu from 'pages/drive/menus/DefaultContextMenu.jsx';
import FileContextMenu from 'pages/drive/menus/FileContextMenu.jsx';
import FolderContextMenu from 'pages/drive/menus/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'pages/drive/menus/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'pages/drive/menus/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'pages/drive/menus/BookmarkContextMenu.jsx';
import TrashContextMenu from 'pages/drive/menus/TrashContextMenu.jsx';
import MainMenu from 'pages/drive/menus/MainMenu';
import ColumnsContextMenu from 'pages/drive/menus/ColumnsContextMenu';


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
        setClickedElements([ ...clickedElements, element ]);
      }   
    } else {
      setClickedElements([ element ]);
    }
  }

  const clearClickedElements = () => {
    setClickedElements([]);
  }

  // UPLOAD
  const openUpload = async () => {
    dropzoneContext.open();
    setIsContextMenuOpen(false);
  }
  
  // DOWNLOAD
  const downloadClickedElements = async () => {
    setIsContextMenuOpen(false);

    for await (const element of clickedElements) {
      await FileService.handleDownload(userData, driveData, element);
    }
  }

  // NAMING
  const [isRenaming, setIsRenaming] = useState(false); // Changed by context menus, changes are read in the elements
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    setIsContextMenuOpen(false);
  }, [isRenaming, isCreatingFolder])

  // CLIPBOARD
  const copyClickedElements = () => {
    setIsContextMenuOpen(false);
    dispatch(copyToClipboard({ originUuid: currentFolderData.uuid, elements: clickedElements }));
  };

  const cutClickedElements = () => {
    setIsContextMenuOpen(false);
    dispatch(cutToClipboard({ originUuid: currentFolderData.uuid, elements: clickedElements }));
  };

  const pasteClickedElements = async () => {
    setIsContextMenuOpen(false);
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
        elements: clipboardData.elements.map(element => ({ ...element, parentUuid: currentFolderData.uuid }))
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
    setIsContextMenuOpen(false);
    
    dispatch(updateBookmarksOnClient(clickedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: { ...element, isRemoved: true } }))
    ))

    dispatch(removeElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))
    .then(async res => {
      if ((res.payload) && (res.type === 'elements/remove/rejected')) {
        dispatch(revertUpdateBookmarksOnClient(res.payload
          .filter(element => element.type === 'folder')
          .map(element => ({ uuid: userData.uuid + element.uuid, folder: element }))
        ))
      }
    })
  }

  const recoverClickedElements = async () => {
    setIsContextMenuOpen(false);

    dispatch(updateBookmarksOnClient(clickedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: { ...element, isRemoved: false } }))
    ))

    dispatch(recoverElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))
    .then(async res => {
      if ((res.payload) && (res.type === 'elements/recover/rejected')) {
        dispatch(revertUpdateBookmarksOnClient(res.payload
          .filter(element => element.type === 'folder')
          .map(element => ({ uuid: userData.uuid + element.uuid, folder: element }))
        ))
      }
    })
  }

  const deleteClickedElements = async () => {
    setIsContextMenuOpen(false);

    dispatch(deleteBookmarksOnClient(clickedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: element }))
    ))

    dispatch(deleteElements({ 
      userData, 
      driveData, 
      elements: clickedElements
    }))    
    .then(async res => {
      if ((res.payload) && (res.type === 'elements/delete/rejected')) {
        dispatch(addBookmarksOnClient(res.payload
          .filter(element => element.type === 'folder')
          .map(element => ({ uuid: userData.uuid + element.uuid, folder: element }))
        ))
      }
    })
  }


  // MENUS HANDLERS
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isContextMenuLockActive, setIsContextMenuLockActive] = useState(false);
  const [isHoveredOverMenu, setIsHoveredOverMenu] = useState(false);

  const [contextMenuType, setContextMenuType] = useState('default');
  const [contextMenuClickPosition, setContextMenuClickPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isContextMenuOpen && !isHoveredOverMenu) {
      setIsContextMenuOpen(false); // Close context menu on mouse down
    } else if (!isContextMenuOpen) {
      setContextMenuClickPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setIsContextMenuOpen(true);
      setIsContextMenuLockActive(true);
    }
  };

  const handleContextMenuLockClick = (event) => { 
    // Works only for clicks outside of menu. For menu option clicks, check handleOnMouseUp
    if (!isContextMenuOpen) {
      setIsContextMenuLockActive(false); // Disable context menu lock only on mouse up
    }
  }

  const handleDefaultContextMenuClick = (event) => {
    handleContextMenuClick(event);

    if (!isContextMenuOpen) {
      clearClickedElements();
      setContextMenuType('default');
    }
  };

  const handleMainMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isContextMenuOpen && !isHoveredOverMenu) {
      setIsContextMenuOpen(false); // Close context menu on mouse down
    } else if (!isContextMenuOpen) {
      setContextMenuClickPosition({
        x: event.target.offsetLeft + event.target.offsetWidth + 8,
        y: event.target.offsetTop + event.target.offsetHeight + 8,
      });
      setIsContextMenuOpen(true);
      setIsContextMenuLockActive(true);
    }

    if (!isContextMenuOpen) {
      clearClickedElements();
      setContextMenuType('main');
    }
  };

  const handleTopPanelContextMenuClick = (event) => {
    clearClickedElements();
  };

  const handleColumnsContextMenuClick = (event) => {
    handleContextMenuClick(event);
    setContextMenuType('columns');
  };

  const handleSidePanelContextMenuClick = (event) => {
    clearClickedElements();
  };
  
  const handleBottomPanelContextMenuClick = (event) => {
    clearClickedElements();
  };
  
  const handleFileContextMenuClick = (event, file) => {
    handleContextMenuClick(event);

    if (!isContextMenuOpen) {
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

    if (!isContextMenuOpen) {
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

  const handleBookmarkContextMenuClick = (event, bookmark) => {
    if (!['home', 'trash'].includes(bookmark.folder.uuid)) {
      handleContextMenuClick(event);
      if (!isContextMenuOpen) {
        addClickedElement(event, bookmark);
        setContextMenuType('bookmark'); 
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };


  // DRAGGING
  const [draggingStartEvent, setDraggingStartEvent] = useState({});
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
    if ((Math.pow(containerPoint.x - mousePointInitial.x, 2) + Math.pow(containerPoint.y - mousePointInitial.y, 2) > Math.pow(10, 2)) 
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
    setDraggingStartEvent(event)

    setMousePointInitial({ x: event.pageX, y: event.pageY });
    setContainerPoint({ x: event.pageX, y: event.pageY });
  }

  const stopDraggingElement = (event) => {
    setIsDraggingElement(false);
    setIsHoldingElement(false);

    if ((!clickedElements.includes(hoveredElement)) && (hoveredElement.type === 'folder') && 
    isDraggingElement && hoveredElement.uuid) {
      // If dragged onto a folder, move the clicked elements
      moveClickedElements();
    } else if (!draggingStartEvent.ctrlKey && !draggingStartEvent.shiftKey && 
    !isDraggingElement && !isContextMenuOpen && hoveredElement.uuid) { 
      // Used to set clicked element if there was no drag attempt after mouse down event
      addClickedElement({}, hoveredElement)
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
      stopDraggingElement(event)

      const staticMenuTypes = ['main']

      if (isContextMenuLockActive && isContextMenuOpen && !staticMenuTypes.includes(contextMenuType)) { 
        // Used to deactivate on menu option click
        // Used for options in context menus which open a modal
        // Does not apply to static menus
        setIsContextMenuLockActive(false);
      }
    }
  };

  const handleOnWrapMouseDown = (event) => {
    if (isContextMenuOpen && !isHoveredOverMenu) { // LMB only, the RMB clicks are handled in context menu handler functions
      setIsContextMenuOpen(false);   
    } 

    if (event.button === 0) {
      if (!hoveredElement.uuid && !isContextMenuOpen && !event.ctrlKey) { // Deselect elements if context menu is not open
        clearClickedElements();  
      }

      if (hoveredElement.uuid) { // Get ready for dragging
        startDraggingElement(event);
      }
    }
  };

  const handleOnElementMouseDown = (event, element, index) => {
    if ((event.button === 0) && event.shiftKey && !isContextMenuOpen && (clickedElements.length > 0) && !clickedElements.includes(element)) {
      const firstElementIndex = currentFolderData.sortedElements.indexOf(clickedElements[0]);

      if (index < firstElementIndex) {
        setClickedElements([ clickedElements[0], ...currentFolderData.sortedElements.slice(index, firstElementIndex) ])
      } else if (index > firstElementIndex) {
        setClickedElements([ clickedElements[0], ...currentFolderData.sortedElements.slice(firstElementIndex + 1, index + 1) ])
      }

    } else if ((event.button === 0) && !isContextMenuOpen && 
    !clickedElements.map(element => element.uuid).includes(element.uuid)) {
      addClickedElement(event, element); // Will get added or appended depending on the ctrl key
    }
  };

  const handleOnMouseMove = (event) => {
    updateDragging(event);
  }

  const handleOnWrapContextMenu = (event) => {
    event.preventDefault();
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
        else if (contextMenuType === 'main') { return <MainMenu /> } 
        else if (contextMenuType === 'columns') { return <ColumnsContextMenu /> } 
      } else if (currentFolderData.uuid === 'trash') {
        if (['file', 'folder', 'file-multiple', 'folder-multiple'].includes(contextMenuType)) { return <TrashContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clickedElements[0]} /> }  
      }
    }
  }

  return (
    <Box className='w-full h-full grid grid-rows-[max-content_1fr] overflow-hidden'
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseDown={handleOnWrapMouseDown}
    onMouseMove={handleOnMouseMove}
    onContextMenu={handleOnWrapContextMenu}>

      <ContextMenuContext.Provider value={{ 
      hoveredElement, setHoveredElement, clearHoveredElement,
      clickedElements, addClickedElement, clearClickedElements,  
      downloadClickedElements, openUpload,
      removeClickedElements, recoverClickedElements, deleteClickedElements,
      copyClickedElements, cutClickedElements, pasteClickedElements, 

      isRenaming, setIsRenaming, isCreatingFolder, setIsCreatingFolder,

      isDraggingElement, containerPoint, mousePointInitial, draggedElementSize,

      isContextMenuOpen, setIsContextMenuOpen, isContextMenuLockActive, setIsContextMenuLockActive, 
      isHoveredOverMenu, setIsHoveredOverMenu,
      getMenu, contextMenuType, contextMenuClickPosition,
      handleOnElementMouseDown,

      handleFileContextMenuClick, handleFolderContextMenuClick, handleBookmarkContextMenuClick, 
      handleDefaultContextMenuClick, 
      handleTopPanelContextMenuClick, handleColumnsContextMenuClick, handleSidePanelContextMenuClick, handleBottomPanelContextMenuClick,
      handleMainMenuClick,
      handleContextMenuLockClick,
      }}> 

        { children }  
        
      </ContextMenuContext.Provider> 

    </Box>
  );
}