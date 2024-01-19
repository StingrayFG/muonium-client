import { useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setElements, setCopy, setCut, setPaste } from 'services/slice/ClipboardSlice.jsx';
import { requestUpdate } from 'services/slice/PathSlice';
import { requestUpdate as requestBookmarkUpdate } from 'services/slice/BookmarkSlice';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileService from 'services/FileService.jsx';
import FolderService from 'services/FolderService.jsx';

export default function ContextMenuComponent ({ children }) {
  const folderContext = useContext(FolderContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);


  const [clickedElements, setClickedElements] = useState([]);
  const [hoveredElement, setHoveredElement] = useState({ uuid: ''});

  const [holdingElement, setHoldingElement] = useState(false);
  const [draggingElement, setDraggingElement] = useState(false);
  const [draggedElementSize, setDraggedElementSize] = useState({ x: 0, y: 0 });

  const [requiresMove, setRequiresMove] = useState(false);
  const [requiresContextMenuClosure, setRequiresContextMenuClosure] = useState(false);

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
    if (clipboardData.elements !== clickedElements) {
      dispatch(setElements(clickedElements));
    }
  })

  const downloadClickedElements = async () => {
    for await (const element of clickedElements) {
      await FileService.handleDownload(userData, element)
    }
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
  }

  const recoverClickedElements = async () => {
    for await (const element of clickedElements) {
      console.log(element)
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
  }

  const deleteClickedElements = async () => {
    for await (const element of clickedElements) {
      if (element.type === 'file') { 
        await FileService.handleDelete(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      } else if (element.type === 'folder') { 
        await FolderService.handleDelete(userData, element)
        .then(() => { dispatch(requestUpdate()); })
      }
    }
  }

  const copyClickedElements = () => {
    dispatch(setCopy({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
    setRequiresContextMenuClosure(true);
  };

  const cutClickedElements = () => {
    dispatch(setCut({ originUuid: folderContext.currentFolder.uuid, elements: clickedElements }));
    setRequiresContextMenuClosure(true);
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
    setRequiresContextMenuClosure(true);
  };

  useEffect(() => {
    const moveElement = async () => {
      if (requiresMove) {
        for await (let element of clickedElements) {
          if (element.type === 'file') {
            await FileService.handleMove(userData, hoveredElement.uuid, element)
            .then(() => { dispatch(requestUpdate()); })
          } else if (element.type === 'folder') {
            await FolderService.handleMove(userData, hoveredElement.uuid, element)
            .then(() => { dispatch(requestUpdate()); })
          }
          setRequiresMove(false);
        }
      }
    }
    moveElement();
  })

  const windowWidth = useRef(window.innerWidth).current;
  const windowHeight = useRef(window.innerHeight).current;

  const updateContainerPoint = (event) => {
    if ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10) && !draggingElement && holdingElement) {
      setDraggingElement(true);
    }
    if (holdingElement) {
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

  const handleMouseEnter = (event, element) => {
    if (event.button === 0) {
      if (!clipboardData.mode) {
        setHoldingElement(true);
        setDraggedElementSize({ x: event.currentTarget.offsetHeight, y: event.currentTarget.offsetWidth });
        addClickedElement(event, element);
    
        setMousePointInitial({ x: event.pageX, y: event.pageY });
        setContainerPointInitial({ x: event.pageX, y: event.pageY });
        setContainerPoint({ x: event.pageX, y: event.pageY });
      }
    }
  }

  const handleMouseLeave = (event) => {
    if (event.button === 0) {
      setDraggingElement(false);
      setHoldingElement(false);
      if (hoveredElement.uuid && (!clickedElements.includes(hoveredElement)) && (hoveredElement.type === 'folder') && draggingElement) {
        setRequiresMove(true);
      }
    }
  }
  
  return (
    <div className='w-full h-full'
    onMouseMove={updateContainerPoint}
    onMouseUp={handleMouseLeave}

    onCopy={copyClickedElements}
    onCut={cutClickedElements}
    onPaste={pasteClickedElements}>
      <CutCopyPasteContext.Provider value={{
        clickedElements, addClickedElement, clearClickedElements, downloadClickedElements, 
        removeClickedElements, recoverClickedElements, deleteClickedElements,
        copyClickedElements, cutClickedElements, pasteClickedElements, 
        hoveredElement, setHoveredElement,
        handleMouseEnter, handleMouseLeave,
        requiresContextMenuClosure, setRequiresContextMenuClosure}}>
        {draggingElement && 
          <div className='bg-gradient-to-b from-sky-200/45 to-sky-400/45 rounded-md' 
          style={{ position: 'absolute', top: containerPoint.y, left: containerPoint.x, width: draggedElementSize.y, height: draggedElementSize.x }}>
          </div>
        }
        {children}
      </CutCopyPasteContext.Provider>   
    </div>
  );
}