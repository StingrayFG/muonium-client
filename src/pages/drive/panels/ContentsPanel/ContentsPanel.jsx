import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { setColumnWidth, setColumnPosition, setSortBy, setSortByAscending } from 'state/slices/settingsSlice';
import { syncSortingData, createElement, renameElements } from 'state/slices/currentFolderSlice';
import { updateBookmarksOnClient, revertUpdateBookmarksOnClient } from 'state/slices/bookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx'

import { useDragHandler } from 'hooks/UseDragHandler';

import FileElement from 'pages/drive/elements/FileElement/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement/FolderElement.jsx';
import RenameModal from 'pages/drive/modals/RenameModal';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

import config from 'config.json';


export default function ContentsPanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const currentFolderData = useSelector(state => state.currentFolder);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  const headerRef = useRef(null);
  const contentsRef = useRef(null);

  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging, updateDelta] = useDragHandler(0);

  const [gridGridColumnsCount, setGridColumnsCount] = useState(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));

  const [resizedColumn, setResizedColumn] = useState({});
  const [movedColumn, setMovedColumn] = useState({});
  const [movedColumnInitialOffset, setMovedColumnInitialOffset] = useState(0);
  const [movedColumnOffset, setMovedColumnOffset] = useState(0);
  const [movedColumnIndex, setMovedColumnIndex] = useState({});

  const [columnsOffsets, setColumnsOffsets] = useState([]);


  // WINDOW RESIZE
  useEffect(() => {
    if (!contentsRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setGridColumnsCount(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));
    });
    resizeObserver.observe(contentsRef.current);

    return () => resizeObserver.disconnect();
  }, [settingsData.gridElementWidth]);

  const handleOnScroll = (event) => {
    headerRef.current.scrollLeft = event?.target?.scrollLeft;
  }


  // LIST VIEW SETTINGS SYNC
  useEffect(() => {
    dispatch(syncSortingData({
      sortBy: settingsData.sortBy, 
      sortByAscending: settingsData.sortByAscending, 
      showFoldersFirst: settingsData.showFoldersFirst
    }))
  }, [settingsData.sortBy, settingsData.sortByAscending, settingsData.showFoldersFirst])

  useEffect(() => {
    const firstColumnOffset = (settingsData.listElementHeight * (7 / 3)) + 8;
    let currentOffset = firstColumnOffset;
    let newColumnsOffsets = [];

    for (const column of settingsData.listViewColumns.filter(c => c.isEnabled)) {
      newColumnsOffsets.push({
        leftOffset: currentOffset,
        rightOffset: currentOffset + column.width
      });
      currentOffset += column.width;
    }

    setColumnsOffsets(newColumnsOffsets);
  }, [settingsData.listViewColumns])


  // HANDLERS
  const handleOnResizeBarMouseDown = (event, column) => {
    if (event.button === 0) {
      updateDelta(0);

      startDragging(event);
      setResizedColumn(column);
    }
  }

  const handleOnResizeBarMouseUp = (event) => {
    stopDragging(event);
    setResizedColumn({});
  } 

  const handleOnResizeBarMouseMove = (event) => {
    updateDragging(event);
    if (isDragging) {
      if ((resizedColumn.width + dragDelta.x) > config.columns.minWidth) {
        dispatch(setColumnWidth({ ...resizedColumn, width: resizedColumn.width + dragDelta.x }));
      }
    }
  }
  
  const handleOnColumnHeaderMouseDown = (event, column) => {
    if ((event.target === event.currentTarget) && (event.button === 0)) {
      updateDelta(10);

      setMovedColumn(column);
      setMovedColumnOffset(event.target.offsetLeft);
      setMovedColumnInitialOffset(event.target.offsetLeft);    
      setMovedColumnIndex(settingsData.listViewColumns
        .filter(c => c.isEnabled)
        .findIndex(c => c.name === column.name))
    }
  }

  const handleOnColumnHeaderMouseUp = (event) => {
    if (!isDragging) {
      if (settingsData.sortBy === movedColumn.name) {
        dispatch(setSortByAscending(!settingsData.sortByAscending));
      } else {
        dispatch(setSortBy(movedColumn.name));
      }      
    }

    stopDragging(event);
    setMovedColumn({});
    setMovedColumnOffset(0);
    setMovedColumnInitialOffset(0);   
  }

  const handleOnColumnHeaderMouseMove = (event) => {
    if (!isHolding) {
      startDragging(event);
    } else {
      updateDragging(event);
      setMovedColumnOffset(movedColumnInitialOffset + dragDelta.x);
      const enabledColumns = settingsData.listViewColumns.filter(c => c.isEnabled);
     
      if ((movedColumnIndex >= 1) && isDragging) {
        if ((movedColumnIndex >= 2) &&
        (movedColumnOffset < columnsOffsets[movedColumnIndex - 1].leftOffset)) {
          const newPosition = settingsData.listViewColumns.findIndex(c => c.name === enabledColumns[movedColumnIndex - 1].name)

          setMovedColumnIndex(enabledColumns.findIndex(c => c.name === enabledColumns[movedColumnIndex - 1].name));

          dispatch(setColumnPosition({ column: movedColumn, position: newPosition }));
          
        } else if ((movedColumnIndex <= enabledColumns.length - 2) && 
        ((movedColumnOffset + movedColumn.width) > columnsOffsets[movedColumnIndex + 1].rightOffset)) {
          const newPosition = settingsData.listViewColumns.findIndex(c => c.name === enabledColumns[movedColumnIndex + 1].name)
          setMovedColumnIndex(enabledColumns.findIndex(c => c.name === enabledColumns[movedColumnIndex + 1].name));

          dispatch(setColumnPosition({ column: movedColumn, position: newPosition }));
       
        }
      }
    }
  } 

  
  // ELEMENT FUNCTIONS
  useEffect(() => {
    if (contextMenuContext.isRenaming || contextMenuContext.isCreatingFolder) {
      if (contextMenuContext.clickedElements.length > 0) {
        modalContext.openModal(<RenameModal name={contextMenuContext.clickedElements[0].name} setName={handleNaming} stopNaming={stopNaming} 
        usedNames={currentFolderData.folders.map(f => f.name)}/>)
      } else {
        modalContext.openModal(<RenameModal name={''} setName={handleNaming} stopNaming={stopNaming} 
        usedNames={currentFolderData.folders.map(f => f.name)}/>)
      }
      
    }
  }, [contextMenuContext.isCreatingFolder, contextMenuContext.isRenaming])

  const stopNaming = () => {
    contextMenuContext.setIsCreatingFolder(false);
    contextMenuContext.setIsRenaming(false);
  }

  const handleNaming = async (name) => {
    if ((contextMenuContext.clickedElements.length === 0) || 
    (name && (name !== contextMenuContext.clickedElements[0].name))) {
      modalContext.closeModal();

      if (contextMenuContext.isCreatingFolder) {
        console.log(contextMenuContext.clickedElements)
        contextMenuContext.setIsCreatingFolder(false);
        const newFolder = { uuid: 'temp-' + Date.now(), name: name, type: 'folder', parentUuid: currentFolderData.uuid };
        dispatch(createElement({ userData, driveData, element: newFolder }))
      } else {
        contextMenuContext.setIsRenaming(false);
        const newFolder = { ...contextMenuContext.clickedElements[0], name: name };
        dispatch(updateBookmarksOnClient([{
          uuid: userData.uuid + newFolder.uuid,
          folder: newFolder
        }]))
        dispatch(renameElements({userData, driveData, elements: [newFolder] }))
        .then(res => {
          if (res.type === 'elements/rename/rejected') {
            dispatch(revertUpdateBookmarksOnClient([{
              uuid: userData.uuid + newFolder.uuid,
              folder: newFolder
            }]))
          }
        })
      }

    } else if (name === currentFolderData.clickedElements[0].name) {
      modalContext.closeModal();
      contextMenuContext.setIsRenaming(false);
    }
  }

  
  // GETS
  const getListViewHeader = () => {
    return (
      <Box className={`h-8 w-full absolute top-0 flex
      transition-opacity duration-300
      overflow-x-auto scrollbar-hidden
      border-b border-sky-300/20 bg-gray-900/40
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      ref={headerRef}
      onContextMenu={contextMenuContext.handleColumnsContextMenuClick}>

        {/* MUI Box has a bug, which results in shrinking animation that is impossible to disable, so a div is used */}
        <div className={`ml-2 shrink-0
        transition-all duration-100
        border-r border-sky-300/20`}
        style={{
          width: settingsData.listElementHeight * (7 / 3) + 'px',
        }} />

        {settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
          <Box className={`shrink-0 
          grid grid-cols-[1fr_max-content]
          transition-all duration-300
          hover:bg-sky-400/10 hover:duration-0
          border-r border-sky-300/20     
          ${(isDragging && (column.name === resizedColumn.name)) ? 'static' : 'relative'}
          ${(column.name === movedColumn.name) ? 'bg-sky-400/10' : 'bg-transparent'}`}
          style={{
            width: column.width
          }}
          key={'header-' + column.name}
          onMouseDown={(event) => handleOnColumnHeaderMouseDown(event, column)}>


            <Box className={`-mr-2 z-10
            cursor-col-resize
            ${(isDragging && (column.name === resizedColumn.name)) ? 'fixed h-dvh w-screen top-0 left-0 ' : 'absolute h-full w-4 right-0'}`}
            onMouseDown={(event) => handleOnResizeBarMouseDown(event, column)}
            onMouseUp={handleOnResizeBarMouseUp}
            onMouseMove={handleOnResizeBarMouseMove}/> {/* Used to stop resizing if mouse leaves the window */}

            <p className='w-full px-2 pointer-events-none
            text-ellipsis overflow-hidden'>
              {config.columns.displayedNames[column.name]}
            </p> 

            <ChevronDown className={`h-4 w-4 mt-2 mr-2 pointer-events-none
            ${(settingsData.sortBy === column.name) ? 'opacity-100' : 'opacity-0'}
            ${settingsData.sortByAscending ? 'rotate-180' : 'rotate-0'}`}/>

          </Box>
        )}

        {movedColumn.name && 
          <Box className={`fixed h-dvh w-screen top-0 left-0 z-20`}
          onMouseUp={handleOnColumnHeaderMouseUp}
          onMouseMove={handleOnColumnHeaderMouseMove} />
        }

        {(isDragging && movedColumn.name) && 
          <Box className={`absolute z-10
          animate-fadein-custom-150 animate-fadeout-custom-150
          shrink-0 grid grid-cols-[1fr_max-content]
          bg-gray-700/80`}
          style={{
            width: movedColumn.width + 'px',
            transform: `translateX(${movedColumnOffset + 'px'})`
          }}
          key={'header-' + movedColumn.name}>

            <p className='w-full px-2 pointer-events-none
            text-ellipsis overflow-hidden'>
              {config.columns.displayedNames[movedColumn.name]}
            </p> 

            <ChevronDown className={`h-4 w-4 mt-2 mr-2 pointer-events-none
            ${(settingsData.sortBy === movedColumn.name) ? 'opacity-100' : 'opacity-0'}
            ${settingsData.sortByAscending ? 'rotate-180' : 'rotate-0'}`}/>

          </Box>
        }
      </Box>
    )
  }

  const getListViewColumns = (element) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const parseColumnValue = (column) => {
      if ((column.name === 'creationDate') || (column.name === 'modificationDate')) {
        return new Date(element[column.name]).toLocaleString('en-GB', options);  
      } else if (column.name === 'size') {
        if (element[column.name] === 1) {
          return element[column.name] + ' item';
        } else if ((element[column.name] === 0) || (element[column.name] > 1)) {
          return element[column.name] + ' items';
        } else {
          return '';
        }
      } else if (column.name === 'type') {
        return element[column.name].charAt(0).toUpperCase() + element[column.name].slice(1);
      } else {
        return element[column.name];
      }
    }

    return (<>{
      settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
        <p data-testid={'file-' + column.name}
        className={`h-8 w-full px-2 my-auto shrink-0
        text-left text-ellipsis overflow-hidden break-all whitespace-nowrap
        ${(column.name === 'name') ? 'text-neutral-200' : 'text-neutral-200/60'}`}
        style={{
          width: column.width
        }}
        key={element.uuid + '-' + column.name}>
          {parseColumnValue(column)}
        </p>
      )
    }</>)
  }

  
  // RENDER
  if (settingsData.viewMode === 'grid') {
    return (
      <Box className={`w-full h-full pb-12 
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}>

        <Box className={`w-full h-full
        overflow-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}
        onContextMenu={contextMenuContext.handleDefaultContextMenuClick}>

          <Box className={`w-full h-fit grid`}
          style={{
            gridTemplateColumns: `repeat(${gridGridColumnsCount}, minmax(0, 1fr))`
          }}>

            {contextMenuContext.isCreatingFolder && (
              <FolderElement folder={{ 
                uuid: '', 
                name: '',
                type: 'folder', 
                parentUuid: currentFolderData.uuid 
              }} />
            )}
      
            {currentFolderData.sortedElements.length > 0 && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid}
                    index={index}
                    folder={element} 
                    isClicked={contextMenuContext.clickedElements.includes(element)}
                    isCut={clipboardData.cutElementsUuids.includes(element.uuid)}/>
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    index={index}
                    file={element} 
                    isClicked={contextMenuContext.clickedElements.includes(element)}                  
                    isCut={clipboardData.cutElementsUuids.includes(element.uuid)}/>
                  )
                }
              })}
            </>}

          </Box> 

        </Box> 

      </Box> 

    ) 

  } else if (settingsData.viewMode === 'list') {
    return (<>
      
      {getListViewHeader()}

      <Box className={`w-full h-full pb-12 pt-8 
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}>

        <Box className={`w-full h-full
        overflow-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}
        onScroll={handleOnScroll}
        onContextMenu={contextMenuContext.handleDefaultContextMenuClick}>
          
          
          <Box className={`w-full h-fit grid`}>
            {contextMenuContext.isCreatingFolder && (
              <FolderElement isCreating={true}/>
            )}

            {currentFolderData.sortedElements.length > 0 && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid}
                    index={index}
                    folder={element} 
                    listViewColumns={getListViewColumns(element)}
                    isClicked={contextMenuContext.clickedElements.includes(element)}
                    isCut={clipboardData.cutElementsUuids.includes(element.uuid)}/>
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    index={index}
                    file={element}
                    listViewColumns={getListViewColumns(element)} 
                    isClicked={contextMenuContext.clickedElements.includes(element)}                  
                    isCut={clipboardData.cutElementsUuids.includes(element.uuid)}/>
                  )
                }
              })}
            </>}
          </Box>  

        </Box>  

      </Box>

    </>)  

  }
  
}

