import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCopy, setCut, setPaste } from 'services/slice/ClipboardSlice.jsx';
import { requestUpdate } from 'services/slice/PathSlice';

import { CutCopyPasteContext } from 'components/drive/main/context/CutCopyPasteContext.jsx';
import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileService from 'services/FileService.jsx';
import FolderService from 'services/FolderService.jsx';

export default function ContextMenuComponent ({ children }) {
  const folderContext = useContext(FolderContext);
  const contextMenuContext = useContext(ContextMenuContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const clipboardData = useSelector(state => state.clipboard);


  const [clickedElement, setClickedElement] = useState({ uuid: '' });
  // Move
  const [hoveredElement, setHoveredElement] = useState({ uuid: ' '});
  const [holdingElement, setHoldingElement] = useState(false);
  const [draggingElement, setDraggingElement] = useState(false);
  const [draggedElementSize, setDraggedElementSize] = useState({ x: 0, y: 0 });

  const [requiresMove, setRequiresMove] = useState(false);
  const [requiresContextMenuClosure, setRequiresContextMenuClosure] = useState(false);

  const [mousePointInitial, setMousePointInitial] = useState({ x: 0, y: 0 });
  const [containerPoint, setContainerPoint] = useState({ x: 0, y: 0 });
  const [containerPointInitial, setContainerPointInitial] = useState({ x: 0, y: 0 });

  const updateContainerPoint = (event) => {
    if ((Math.abs(containerPoint.x - containerPointInitial.x) > 10) && (Math.abs(containerPoint.y - containerPointInitial.y) > 10) && !draggingElement && holdingElement) {
      setDraggingElement(true);
    }
    if (holdingElement) {
      setContainerPoint({
        x: containerPointInitial.x + (event.pageX - mousePointInitial.x),
        y: containerPointInitial.y + (event.pageY - mousePointInitial.y),
      });
    }
  }

  const moveElement = async () => {
    if (requiresMove) {
      console.log(clickedElement)
      if (clickedElement.type === 'file') {
        await FileService.handleMove(userData, hoveredElement.uuid, clickedElement)
        .then(() => {
          dispatch(requestUpdate());
        })
      } else if (clickedElement.type === 'folder') {
        FolderService.handleMove(userData, hoveredElement.uuid, clickedElement)
        .then(() => {
          dispatch(requestUpdate());
        })
      }
      setRequiresMove(false);
    }
  }
  moveElement();

  const enableDragging = (event, element) => {
    if (event.button === 0) {
      setHoldingElement(true);
      setDraggedElementSize({ x: event.currentTarget.offsetHeight, y: event.currentTarget.offsetWidth })
      setClickedElement(element);
  
      setMousePointInitial({ x: event.pageX, y: event.pageY });
      setContainerPointInitial({ x: event.pageX, y: event.pageY });
      setContainerPoint({ x: event.pageX, y: event.pageY });
    }
  }

  const disableDragging = (event) => {
    if (event.button === 0) {
      setDraggingElement(false);
      setHoldingElement(false);
      if (hoveredElement.uuid && (hoveredElement.uuid !== clickedElement.uuid) && draggingElement) {
        setRequiresMove(true);
      }
    }
  }

  const handleCopy = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(setCopy({ originUuid: folderContext.currentFolder.uuid, elements: [clickedElement] }));
    setRequiresContextMenuClosure(true);
  };

  const handleCut = (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(clickedElement)
    dispatch(setCut({ originUuid: folderContext.currentFolder.uuid, elements: [clickedElement] }));
    setRequiresContextMenuClosure(true);
  };
  
  const handlePaste = (event) => {
    event.preventDefault();
    event.stopPropagation();

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
    setRequiresContextMenuClosure(true);
  };
  

  return (
    <div className='w-full h-full'
    onMouseMove={updateContainerPoint}
    onMouseUp={disableDragging}

    onCopy={handleCopy}
    onCut={handleCut}
    onPaste={handlePaste}>
      <CutCopyPasteContext.Provider value={{
        hoveredElement, setHoveredElement,
        clickedElement, setClickedElement, 
        enableDragging, disableDragging,
        handleCopy, handleCut, handlePaste,
        requiresContextMenuClosure, setRequiresContextMenuClosure}}>
        {draggingElement && 
          <div className='bg-gradient-to-b from-sky-200/45 to-sky-400/45 rounded-md' 
          style={{position: 'absolute', top: containerPoint.y, left: containerPoint.x, width: draggedElementSize.y, height:draggedElementSize.x}}>
          </div>
        }
        {children}
      </CutCopyPasteContext.Provider>   
    </div>
  );
}