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

import { env } from 'env.js'


export default function ContextMenuWrap ({ children }) {
  const dispatch = useDispatch();
  
  const dropzoneContext = useContext(DropzoneContext);

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const currentFolderData = useSelector(state => state.currentFolder);

  const [selectedElements, setSelectedElements] = useState([]);
  const [hoveredElement, setHoveredElement] = useState({ uuid: '' });


  // SELECTION
  const addSelectedElement = (event, element) => {
    if (event?.ctrlKey) {
      if (!selectedElements.includes(element)) {
        setSelectedElements([ ...selectedElements, element ]);
      }   
    } else {
      setSelectedElements([ element ]);
    }
  }

  const clearSelectedElements = () => {
    setSelectedElements([]);
  }

  // CONTEXT MENU OPTION HANDLERS
  // UPLOAD
  const openUpload = async () => {
    setIsContextMenuOpen(false);
    dropzoneContext.open();
  }
  
  // DOWNLOAD
  const downloadSelectedElements = async () => {
    setIsContextMenuOpen(false);

    for await (const element of selectedElements) {
      await FileService.handleDownload(userData, driveData, element)
      .then(res => {
        //console.log(res, env.REACT_APP_SERVER_URL + '/file/download/' + element.uuid + '/' + res.downloadToken)
        window.location.href = (env.REACT_APP_SERVER_URL + '/file/download/' + element.uuid + '/' + res.downloadToken);
      })
    }
  }

  // NAMING
  const [isRenaming, setIsRenaming] = useState(false); // Changed by context menus, changes are read in the elements
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    setIsContextMenuOpen(false);
  }, [isRenaming, isCreatingFolder])

  // CLIPBOARD
  const copySelectedElements = () => {
    setIsContextMenuOpen(false);
    dispatch(copyToClipboard({ originUuid: currentFolderData.uuid, elements: selectedElements }));
  };

  const cutSelectedElements = () => {
    setIsContextMenuOpen(false);
    dispatch(cutToClipboard({ originUuid: currentFolderData.uuid, elements: selectedElements }));
  };

  const pasteSelectedElements = async () => {
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

  const moveSelectedElements = async () => { // Used to move by dragging elements
    dispatch(moveElements({ 
      userData, 
      driveData, 
      elements: selectedElements.map(element => ({ ...element, parentUuid: hoveredElement.uuid }))
    }))
  }

  const updateSelectedElement = async (updatedElement) => {
    selectedElements.find((element, index) => {
      if (element.uuid === updatedElement.uuid) { 
        selectedElements[index] = updatedElement;
      }
    })
  }

  // TRASH
  const removeSelectedElements = async () => {
    setIsContextMenuOpen(false);
    
    dispatch(updateBookmarksOnClient(selectedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: { ...element, isRemoved: true } }))
    ))

    dispatch(removeElements({ 
      userData, 
      driveData, 
      elements: selectedElements
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

  const recoverSelectedElements = async () => {
    setIsContextMenuOpen(false);

    dispatch(updateBookmarksOnClient(selectedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: { ...element, isRemoved: false } }))
    ))

    dispatch(recoverElements({ 
      userData, 
      driveData, 
      elements: selectedElements
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

  const deleteSelectedElements = async () => {
    setIsContextMenuOpen(false);

    dispatch(deleteBookmarksOnClient(selectedElements
      .filter(element => element.type === 'folder')
      .map(element => ({ uuid: userData.uuid + element.uuid, folder: element }))
    ))

    dispatch(deleteElements({ 
      userData, 
      driveData, 
      elements: selectedElements
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
  const [isOpeningStaticMenu, setIsOpeningStaticMenu] = useState(false);

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
    console.log(event)
    // Works only for clicks outside of menu. For menu option clicks, check handleOnMouseUp
    if (!isContextMenuOpen) {
      setIsContextMenuLockActive(false); // Disable context menu lock only on mouse up
    } else if (getIsOnMobile()) {
      setIsContextMenuOpen(false);
      setIsContextMenuLockActive(false);
    }
  }

  const handleDefaultContextMenuClick = (event) => {
    handleContextMenuClick(event);

    if (!isContextMenuOpen) {
      clearSelectedElements();
      setContextMenuType('default');
    }
  };

  const handleMainMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isContextMenuOpen && !isHoveredOverMenu) {
      setIsContextMenuOpen(false); // Close context menu on mouse down
    } else if (!isContextMenuOpen) {
      console.log(event.target)
      setContextMenuClickPosition({
        x: event.target.offsetLeft + event.target.offsetWidth + 8,
        y: event.target.offsetTop + event.target.offsetHeight + 8,
      });
      setIsContextMenuOpen(true);
      setIsContextMenuLockActive(true);
      setIsOpeningStaticMenu(true);
    }

    if (!isContextMenuOpen) {
      clearSelectedElements();
      setContextMenuType('main');
    }
  };

  const handleTopPanelContextMenuClick = (event) => {
    clearSelectedElements();
  };

  const handleColumnsContextMenuClick = (event) => {
    handleContextMenuClick(event);
    setContextMenuType('columns');
  };

  const handleSidePanelContextMenuClick = (event) => {
    clearSelectedElements();
  };
  
  const handleBottomPanelContextMenuClick = (event) => {
    clearSelectedElements();
  };
  
  const handleFileContextMenuClick = (event, file) => {
    handleContextMenuClick(event);

    if (!isContextMenuOpen) {
      if (selectedElements.length <= 1) {
        addSelectedElement(event, file);
        setContextMenuType('file')
      } else {
        // Will replace the selectedElements if ctrl key is not pressed and 
        // the newly clicked element is not already in the selectedElements, otherwise nothing will happen
        if (!selectedElements.includes(file)) { 
          addSelectedElement(event, file); 
        }
        if (selectedElements.map(element => element.type).includes('folder')) {
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
      if (selectedElements.length <= 1) {
        addSelectedElement(event, folder);
        setContextMenuType('folder');
      } else {
        // Will replace the selectedElements if ctrl key is not pressed and 
        // the newly clicked element is not already in the selectedElements, otherwise nothing will happen
        if (!selectedElements.includes(folder)) { 
          addSelectedElement(event, folder); 
        }
        setContextMenuType('folder-multiple');
      }
    }
  };

  const handleBookmarkContextMenuClick = (event, bookmark) => {
    if (!['home', 'trash'].includes(bookmark.folder.uuid)) {
      handleContextMenuClick(event);
      if (!isContextMenuOpen) {
        addSelectedElement(event, bookmark);
        setContextMenuType('bookmark'); 
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  
  // WINDOW SIZE
  const getWindowSize = () => {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


  // DRAGGING
  const [draggingStartEvent, setDraggingStartEvent] = useState({});
  const [draggedElementSize, setDraggedElementSize] = useState({ x: 0, y: 0 });
  const [isHoldingElement, setIsHoldingElement] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);

  const [mousePointInitial, setMousePointInitial] = useState({ x: 0, y: 0 });
  const [containerPoint, setContainerPoint] = useState({ x: 0, y: 0 });

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

      if ((mousePointInitial.x + movementDelta.x + draggedElementSize.x) >= windowSize.innerWidth) { // Prevent overflow on the right
        newContainerPoint.x = windowSize.innerWidth - draggedElementSize.y;
      } else if ((mousePointInitial.x + movementDelta.x) < 0) { // Prevent overflow on the left
        newContainerPoint.x = 0;
      } else {
        newContainerPoint.x = event.clientX;
      }

      if ((mousePointInitial.y + movementDelta.y + draggedElementSize.y) >= windowSize.innerHeight) { // Prevent overflow on the bottom
        newContainerPoint.y = windowSize.innerHeight - draggedElementSize.x;
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
    setDraggedElementSize({ x: event.target.offsetHeight, y: event.target.offsetHeight });
    setDraggingStartEvent(event)

    setMousePointInitial({ x: event.pageX, y: event.pageY });
    setContainerPoint({ x: event.pageX, y: event.pageY });
  }

  const stopDraggingElement = (event) => {
    setIsDraggingElement(false);
    setIsHoldingElement(false);

    if ((!selectedElements.includes(hoveredElement)) && (hoveredElement.type === 'folder') && 
    isDraggingElement && hoveredElement.uuid) {
      // If dragged onto a folder, move the clicked elements
      moveSelectedElements();
    } else if (!draggingStartEvent.ctrlKey && !draggingStartEvent.shiftKey && 
    !isDraggingElement && !isContextMenuOpen && hoveredElement.uuid) { 
      // Used to set clicked element if there was no drag attempt after mouse down event
      addSelectedElement({}, hoveredElement)
    }
  }

  // EVENTS HANDLERS
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', setWindowWidth);
  }, [])

  const getIsOnMobile = () => {
    return (windowWidth < 768)
  }

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      clearSelectedElements();
      dispatch(clearClipboard());
    }
  }

  const handleOnMouseUp = (event) => {
    event.preventDefault();

    if (!getIsOnMobile()) {
      if (event.button === 0) {
        stopDraggingElement(event);
        setIsOpeningStaticMenu(false);
  
        if (isContextMenuLockActive && isContextMenuOpen && !isOpeningStaticMenu) { 
          // Used to deactivate on menu option click
          // Used for options in context menus which open a modal
          setIsContextMenuLockActive(false);
          setIsContextMenuOpen(false);
        }
      } 
      // TEMPORARY: DO NOT CLOSE THE MENU ON RMB CLICK
    }
  };
  
  const clickableElementBoxesIds = ['folder-icon-box', 'folder-name-box', 'folder-row-box', 'file-icon-box', 'file-name-box', 'file-row-box'];

  const handleOnWrapMouseDown = (event) => {
    if (getIsOnMobile()) {
      //console.log(event.target, event.currentTarget)
      if (!clickableElementBoxesIds.includes(event.target.id)) {
        clearSelectedElements()
      }

    } else {
      if (isContextMenuOpen && !isHoveredOverMenu) { // LMB only, the RMB clicks are handled in context menu handler functions
        setIsContextMenuOpen(false);   
      } 
  
      if ((event.button === 0)) {
        if (!hoveredElement.uuid && !isContextMenuOpen && !event.ctrlKey) { // Deselect elements if context menu is not open
          clearSelectedElements();  
        }
  
        if (hoveredElement.uuid) { // Get ready for dragging
          startDraggingElement(event);
        }
      }
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
        else if (contextMenuType === 'folder') { return <FolderContextMenu folder={selectedElements[0]} /> }  
        else if (contextMenuType === 'file-multiple') { return <MultipleFileContextMenu /> }
        else if (contextMenuType === 'folder-multiple') { return <MultipleFolderContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={selectedElements[0]} /> } 
        else if (contextMenuType === 'main') { return <MainMenu /> } 
        else if (contextMenuType === 'columns') { return <ColumnsContextMenu /> } 
      } else if (currentFolderData.uuid === 'trash') {
        if (['file', 'folder', 'file-multiple', 'folder-multiple'].includes(contextMenuType)) { return <TrashContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={selectedElements[0]} /> }  
      }
    }
  }

  return (
    <Box className='w-full h-full grid grid-rows-[max-content_1fr] overflow-hidden'
    tabIndex={0}
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseMove={handleOnMouseMove}
    onContextMenu={e => e.preventDefault()}>

      <ContextMenuContext.Provider value={{ 
      getIsOnMobile, 

      hoveredElement, setHoveredElement, clearHoveredElement,
      selectedElements, setSelectedElements, addSelectedElement, updateSelectedElement, clearSelectedElements,  
      downloadSelectedElements, openUpload,
      removeSelectedElements, recoverSelectedElements, deleteSelectedElements,
      copySelectedElements, cutSelectedElements, pasteSelectedElements, 

      isRenaming, setIsRenaming, isCreatingFolder, setIsCreatingFolder,

      isDraggingElement, containerPoint, mousePointInitial, draggedElementSize,

      isContextMenuOpen, setIsContextMenuOpen, isContextMenuLockActive, setIsContextMenuLockActive, 
      isHoveredOverMenu, setIsHoveredOverMenu,
      getMenu, contextMenuType, contextMenuClickPosition,
      handleOnWrapMouseDown,

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