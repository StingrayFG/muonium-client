import { useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCopy, setCut, setPaste } from 'state/slices/ClipboardSlice.jsx';
import { setElements } from 'state/slices/SelectionSlice.jsx';
import { requestUpdate } from 'state/slices/PathSlice';
import { deleteBookmark, requestUpdate as requestBookmarkUpdate } from 'state/slices/BookmarkSlice';

import { CutCopyPasteContext } from 'contexts/CutCopyPasteContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

import FileService from 'services/FileService.jsx';
import FolderService from 'services/FolderService.jsx';

export default function ClipboardWrap ({ children }) {
  const folderContext = useContext(FolderContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);
  const selectionData = useSelector(state => state.selection);

  const [clickedElements, setClickedElements] = useState([]);
  const [hoveredElement, setHoveredElement] = useState({ uuid: ''});
  const [draggedElementSize, setDraggedElementSize] = useState({ x: 0, y: 0 });

  const [isHoldingElement, setIsHoldingElement] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);

  const [doesRequireMove, setDoesRequireMove] = useState(false);
  const [doesRequireMenuClosure, setDoesRequireMenuClosure] = useState(false);

  const [mousePointInitial, setMousePointInitial] = useState({ x: 0, y: 0 });
  const [containerPoint, setContainerPoint] = useState({ x: 0, y: 0 });
  const [containerPointInitial, setContainerPointInitial] = useState({ x: 0, y: 0 });

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
      }
    }
  })

  // Basic actions
  const downloadClickedElements = async () => {
    for await (const element of clickedElements) {
      await FileService.handleDownload(userData, element)
    }
    setDoesRequireMenuClosure(true);
  }

  const removeClickedElements = async () => {
    for await (const element of clickedElements) {
      if (element.type === 'file') { 
        await FileService.handleRemove(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      } else if (element.type === 'folder') { 
        await FolderService.handleRemove(userData, element)
        .then(() => { 
          dispatch(requestBookmarkUpdate());
          dispatch(requestUpdate()); 
        })
      }
    }
    setDoesRequireMenuClosure(true);
  }

  const recoverClickedElements = async () => {
    for await (const element of clickedElements) {
      if (element.type === 'file') { 
        await FileService.handleRecover(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      } else if (element.type === 'folder') { 
        await FolderService.handleRecover(userData, element)
        .then(() => { 
          dispatch(requestBookmarkUpdate());
          dispatch(requestUpdate()); 
        })
      }
    }
    setDoesRequireMenuClosure(true);
  }

  const deleteClickedElements = async () => {
    for await (const element of clickedElements) {
      if (element.type === 'file') { 
        await FileService.handleDelete(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      } else if (element.type === 'folder') { 
        await FolderService.handleDelete(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      } else if (element.type === 'bookmark') { 
        dispatch(deleteBookmark({ userData, folder: clickedElements[0].folder }));
      }
    }
    setDoesRequireMenuClosure(true);
  }
  
  // Clipboard
  const copyClickedElements = () => {
    dispatch(setCopy({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
    setDoesRequireMenuClosure(true);
  };

  const cutClickedElements = () => {
    dispatch(setCut({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
    setDoesRequireMenuClosure(true);
  };

  const pasteClickedElements = async () => {
    if (clipboardData.mode === 'copy') {
      for await (let element of clipboardData.elements) {
        if (element.type === 'file') {
          await FileService.handleCopy(userData, folderContext.currentFolder.uuid, element)
          .then(() => { dispatch(requestUpdate()); })
        }
      }
    } else if (clipboardData.mode === 'cut') {
      for await (let element of clipboardData.elements) {
        if (element.type === 'file') { 
          await FileService.handleMove(userData, folderContext.currentFolder.uuid, element)
          .then(() => { dispatch(requestUpdate()); })
        } else if (element.type === 'folder') { 
          await FolderService.handleMove(userData, folderContext.currentFolder.uuid, element)
          .then(() => { dispatch(requestUpdate()); })
        }
      }
    }
    dispatch(setPaste());
    setDoesRequireMenuClosure(true);
  };

  const clearClipboardElements = async () => {
    dispatch(setPaste());
    dispatch(requestUpdate());
  }

  useEffect(() => {
    const moveElement = async () => {
      if (doesRequireMove) {
        for await (let element of clickedElements) {
          if (element.type === 'file') {
            await FileService.handleMove(userData, hoveredElement.uuid, element)
            .then(() => { dispatch(requestUpdate()); })
          } else if (element.type === 'folder') {
            await FolderService.handleMove(userData, hoveredElement.uuid, element)
            .then(() => { dispatch(requestUpdate()); })
          }
          setDoesRequireMove(false);
        }
      }
    }
    moveElement();
  })

  // Create / rename
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const customSetRenaming = (v) => {
    setIsRenaming(v);
    setDoesRequireMenuClosure(true);
  }

  const customSetCreatingFolder = (v) => {
    setIsCreatingFolder(v);
    setDoesRequireMenuClosure(true);
  }

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const updateContainerPoint = (event) => {
    if ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10) && !isDraggingElement && isHoldingElement) {
      setIsDraggingElement(true);
    }
    if (isHoldingElement) {
      if ((containerPointInitial.x + (event.pageX - mousePointInitial.x) + draggedElementSize.y) >= windowWidth) {
        setContainerPoint((prev) => ({ ...prev, x: windowWidth - draggedElementSize.y }));
      } else if ((containerPointInitial.x + (event.pageX - mousePointInitial.x)) < 0) {
        setContainerPoint((prev) => ({ ...prev, x: 0 }));
      } else {
        setContainerPoint((prev) => ({ ...prev, x: containerPointInitial.x + (event.pageX - mousePointInitial.x) }));
      }

      if ((containerPointInitial.y + (event.pageY - mousePointInitial.y) + draggedElementSize.x) >= windowHeight) {
        setContainerPoint((prev) => ({ ...prev, y: windowHeight - draggedElementSize.x }));
      } else if ((containerPointInitial.y + (event.pageY - mousePointInitial.y)) < 0) {
        setContainerPoint((prev) => ({ ...prev, y: 0 }));
      } else {
        setContainerPoint((prev) => ({ ...prev, y: containerPointInitial.y + (event.pageY - mousePointInitial.y) }));
      }
    }
  }

  const handleMouseDown = (event, element) => {
    if (event.button === 0) {
      if (!clipboardData.mode) {
        setIsHoldingElement(true);
        setDraggedElementSize({ x: event.currentTarget.offsetHeight, y: event.currentTarget.offsetWidth });
        if (clickedElements.length > 1) {
          addClickedElement({ ...event, ctrlKey: true }, element);
        } else {
          addClickedElement(event, element);
        }
    
        setMousePointInitial({ x: event.pageX, y: event.pageY });
        setContainerPointInitial({ x: event.pageX, y: event.pageY });
        setContainerPoint({ x: event.pageX, y: event.pageY });
      }
    }
  }

  const handleMouseUp = (event) => {
    if (event.button === 0) {
      setIsDraggingElement(false);
      setIsHoldingElement(false);
      if (hoveredElement.uuid && (!clickedElements.includes(hoveredElement)) && (hoveredElement.type === 'folder') && isDraggingElement) {
        setDoesRequireMove(true);
      }
    }
  }

  return (
    <div className='w-full h-full'
    onMouseMove={updateContainerPoint}
    onMouseUp={handleMouseUp}

    tabIndex="0"
    onKeyDown={(event) => { if (event.code === 'Escape') { clearClipboardElements() } }}

    onCopy={copyClickedElements}
    onCut={cutClickedElements}
    onPaste={pasteClickedElements}>
      <CutCopyPasteContext.Provider value={{
        clickedElements, addClickedElement, clearClickedElements, downloadClickedElements, 
        removeClickedElements, recoverClickedElements, deleteClickedElements,
        copyClickedElements, cutClickedElements, pasteClickedElements, 
        hoveredElement, setHoveredElement,
        isDraggingElement,
        handleMouseDown, handleMouseUp,
        isRenaming, setIsRenaming: customSetRenaming, isCreatingFolder, setIsCreatingFolder: customSetCreatingFolder,
        doesRequireMenuClosure, setDoesRequireMenuClosure}}>
        {isDraggingElement && 
          <div className='bg-gradient-to-b from-sky-200/45 to-sky-400/45 rounded-md' 
          style={{ position: 'absolute', top: containerPoint.y, left: containerPoint.x, width: draggedElementSize.y, height: draggedElementSize.x }}>
          </div>
        }
        {children}
      </CutCopyPasteContext.Provider>   
    </div>
  );
}