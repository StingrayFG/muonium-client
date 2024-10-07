import { useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { setCopy, setCut, setPaste } from 'state/slices/ClipboardSlice.jsx';
import { setElements } from 'state/slices/SelectionSlice.jsx';
import { deleteBookmark } from 'state/slices/BookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

import FileService from 'services/FileService.jsx';
import FolderService from 'services/FolderService.jsx';

import DefaultContextMenu from 'pages/drive/menus/DefaultContextMenu.jsx';
import FileContextMenu from 'pages/drive/menus/FileContextMenu.jsx';
import FolderContextMenu from 'pages/drive/menus/FolderContextMenu.jsx';
import MultipleFileContextMenu from 'pages/drive/menus/MultipleFileContextMenu.jsx';
import MultipleFolderContextMenu from 'pages/drive/menus/MultipleFolderContextMenu.jsx';
import BookmarkContextMenu from 'pages/drive/menus/BookmarkContextMenu.jsx';
import TrashContextMenu from 'pages/drive/menus/TrashContextMenu.jsx';


export default function ContextMenuWrap ({ children }) {
  const dispatch = useDispatch();

  const folderContext = useContext(FolderContext);
  
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const selectionData = useSelector(state => state.selection);


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

  useEffect(() => {
    if ((selectionData.elements !== clickedElements)) {
      if (clickedElements.length > 0) {
        if (clickedElements[0].type !== 'bookmark') {
          dispatch(setElements(clickedElements));
        }
      } else {
        dispatch(setElements(clickedElements));
      }
    }
  }, [clickedElements])


  // CLIPBOARD
  const copyClickedElements = () => {
    setIsContextMenu(false);
    dispatch(setCopy({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
  };

  const cutClickedElements = () => {
    setIsContextMenu(false);
    dispatch(setCut({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
  };

  const pasteClickedElements = async () => {
    setIsContextMenu(false);
    dispatch(setPaste());

    if (clipboardData.mode === 'copy') {
      for await (const element of clipboardData.elements) {
        folderContext.addElementOnClient(element);

        if (element.type === 'file') {
          await FileService.handleCopy(userData, driveData, { ...element, parentUuid: folderContext.currentFolder.uuid })
          .catch(() => {
            folderContext.addElementOnClient(element);
          })
        }
      }
    } else if (clipboardData.mode === 'cut') {
      for await (const element of clipboardData.elements) {
        folderContext.addElementOnClient(element);

        if (element.type === 'file') { 
          await FileService.handleMove(userData, driveData, { ...element, parentUuid: folderContext.currentFolder.uuid } )
          .catch(() => {
            folderContext.addElementOnClient(element);
          })
        } else if (element.type === 'folder') { 
          await FolderService.handleMove(userData, driveData, { ...element, parentUuid: folderContext.currentFolder.uuid } )
          .catch(() => {
            folderContext.addElementOnClient(element);
          })
        }
      }
    }
  };

  const moveClickedElements = async () => { // Used to move by dragging elements
    for await (let element of clickedElements) {
      folderContext.deleteElementOnClient(element);

      if (element.type === 'file') {
        await FileService.handleMove(userData, driveData, { ...element, parentUuid: hoveredElement.uuid })
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      } else if (element.type === 'folder') {
        await FolderService.handleMove(userData, driveData, { ...element, parentUuid: hoveredElement.uuid })
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      }
    }
  }

  const clearClipboardElements = async () => {
    dispatch(setPaste());
  }


  // NAMING
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    setIsContextMenu(false);
  }, [isRenaming, isCreatingFolder])


  // DOWNLOAD
  const downloadClickedElements = async () => {
    setIsContextMenu(false);

    for await (const element of clickedElements) {
      await FileService.handleDownload(userData, driveData, element);
    }
  }
  

  // TRASH
  const removeClickedElements = async () => {
    setIsContextMenu(false);

    for await (const element of clickedElements) {
      folderContext.deleteElementOnClient(element);

      if (element.type === 'file') { 
        await FileService.handleRemove(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      } else if (element.type === 'folder') { 
        await FolderService.handleRemove(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      }
    }
  }

  const recoverClickedElements = async () => {
    setIsContextMenu(false);

    for await (const element of clickedElements) {
      folderContext.deleteElementOnClient(element);

      if (element.type === 'file') {  
        await FileService.handleRecover(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      } else if (element.type === 'folder') { 
        await FolderService.handleRecover(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      }
    }  
  }

  const deleteClickedElements = async () => {
    setIsContextMenu(false);

    for await (const element of clickedElements) {
      folderContext.deleteElementOnClient(element);

      if (element.type === 'file') { 
        await FileService.handleDelete(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      } else if (element.type === 'folder') { 
        await FolderService.handleDelete(userData, driveData, element)
        .catch(() => {
          folderContext.addElementOnClient(element);
        })
      } else if (element.type === 'bookmark') { 
        dispatch(deleteBookmark({ userData, folderData: clickedElements[0].folder }));
      }
    }
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
      if (clickedElements.length === 0) {
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
      if (clickedElements.length === 0) {
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
      clearClipboardElements();
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
      if (folderContext.currentFolder.uuid !== 'trash') {
        if (contextMenuType === 'default') { return <DefaultContextMenu /> }
        else if (contextMenuType === 'file') { return <FileContextMenu /> } 
        else if (contextMenuType === 'folder') { return <FolderContextMenu folder={clickedElements[0]} /> }  
        else if (contextMenuType === 'file-multiple') { return <MultipleFileContextMenu /> }
        else if (contextMenuType === 'folder-multiple') { return <MultipleFolderContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clickedElements[0]} /> }  
      } else if (folderContext.currentFolder.uuid  === 'trash') {
        if (['file', 'folder', 'file-multiple', 'folder-multiple'].includes(contextMenuType)) { return <TrashContextMenu /> }
        else if (contextMenuType === 'bookmark') { return <BookmarkContextMenu bookmark={clickedElements[0]} /> }  
      }
    }
  }

  return (
    <Box className='w-full h-full grid grid-cols-[max-content_1fr]'
    onKeyDown={handleOnKeyDown}
    onMouseUp={handleOnMouseUp}
    onMouseDown={handleOnWrapMouseDown}
    onMouseMove={handleOnMouseMove}
    onContextMenu={handleDefaultContextMenuClick}>

      <ContextMenuContext.Provider value={{ 
      clickedElements, addClickedElement, clearClickedElements, downloadClickedElements, 
      removeClickedElements, recoverClickedElements, deleteClickedElements,
      copyClickedElements, cutClickedElements, pasteClickedElements, 
      hoveredElement, setHoveredElement, clearHoveredElement,
      isRenaming, setIsRenaming, isCreatingFolder, setIsCreatingFolder,
      handleOnElementMouseDown,
      isContextMenu, contextMenuClickPosition,
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