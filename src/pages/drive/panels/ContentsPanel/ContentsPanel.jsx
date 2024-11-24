import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { setColumnWidth, setColumnPosition, setSortBy, setSortByAscending } from 'state/slices/settingsSlice';
import { syncSortingData } from 'state/slices/currentFolderSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { useDragHandler } from 'hooks/UseDragHandler';

import FileElement from 'pages/drive/elements/FileElement/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement/FolderElement.jsx';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

import config from 'config.json';


export default function ContentsPanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);

  const currentFolderData = useSelector(state => state.currentFolder);
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


  // STATE SYNC
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

  
  // GETS
  const getListViewHeader = () => {

    return (
      <Box className='h-8 w-full absolute top-0 flex
      overflow-x-auto scrollbar-hidden
      border-b border-sky-300/20 bg-gray-900/40'
      ref={headerRef}
      onContextMenu={contextMenuContext.handleColumnsContextMenuClick}>

        {/* MUI Box has a shrinking animation that is impossible to disable, so a div is used */}
        <div className={`ml-2 shrink-0
        transition-all duration-100
        border-r border-sky-300/20`}
        style={{
          width: settingsData.listElementHeight * (7 / 3) + 'px',
        }} />

        {settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
          <Box className={`shrink-0 
          grid grid-cols-[1fr_max-content]
          border-r border-sky-300/20
          ${(isDragging && (column.name === resizedColumn.name)) ? 'static' : 'relative'}`}
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
          shrink-0 grid grid-cols-[1fr_max-content]
          bg-gray-700/80`}
          style={{
            width: movedColumn.width + 'px',
            left: movedColumnOffset + 'px'
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

  
  // RENDER
  if (settingsData.viewMode === 'grid') {
    return (
      <Box className={`w-full h-full pb-12
      overflow-y-auto overflow-x-hidden
      scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
      ref={contentsRef}
      onContextMenu={contextMenuContext.handleDefaultContextMenuClick}>

        <Box className={`w-full h-fit grid`}
        style={{
          gridTemplateColumns: `repeat(${gridGridColumnsCount}, minmax(0, 1fr))`
        }}>

          {contextMenuContext.isCreatingFolder && (
            <FolderElement />
          )}
    
          {currentFolderData.sortedElements.length > 0 && <>
            {currentFolderData.sortedElements.map((element, index) => {
              if (element.type === 'folder') {
                return (
                  <FolderElement key={element.uuid} 
                  folder={element} 
                  index={index}/>
                )
              } else if (element.type === 'file') {
                return (
                  <FileElement key={element.uuid} 
                  file={element} 
                  index={index}/>
                )
              }
            })}
          </>}

        </Box> 

      </Box>  
      )  
  } else if (settingsData.viewMode === 'list') {
    return (<>
      
      {getListViewHeader()}

      <Box className='w-full h-full pb-12 pt-8 '>

        <Box className={`w-full h-full
        overflow-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}
        onScroll={handleOnScroll}
        onContextMenu={contextMenuContext.handleDefaultContextMenuClick}>
          
          
          <Box className={`w-full h-fit grid`}>
            {contextMenuContext.isCreatingFolder && (
              <FolderElement />
            )}

            {currentFolderData.sortedElements.length > 0 && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid} 
                    folder={element} 
                    index={index}/>
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    file={element} 
                    index={index}/>
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

