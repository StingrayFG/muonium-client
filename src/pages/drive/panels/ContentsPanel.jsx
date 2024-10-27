import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { setColumnWidth, setSortBy, setSortByAscending } from 'state/slices/settingsSlice';
import { syncSortingData } from 'state/slices/currentFolderSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { useDragHandler } from 'hooks/UseDragHandler';

import FileElement from 'pages/drive/elements/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement.jsx';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

import config from 'config.json';


export default function ContentsPanel () {
  const dispatch = useDispatch();

  const contextMenuContext = useContext(ContextMenuContext);

  const currentFolderData = useSelector(state => state.currentFolder);
  const settingsData = useSelector(state => state.settings);

  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging] = useDragHandler(0);

  const headerRef = useRef(null);
  const contentsRef = useRef(null);
  const [gridGridColumnsCount, setGridColumnsCount] = useState(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));


  // RESIZE
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


  // HANDLERS
  const [resizedColumn, setResizedColumn] = useState({});

  const handleOnMouseDown = (event, column) => {
    startDragging(event);
    setResizedColumn(column);
  }

  const handleOnMouseUp = (event) => {
    stopDragging(event);
    if ((resizedColumn.width + dragDelta.x) > config.columns.minWidth) {
      dispatch(setColumnWidth({ ...resizedColumn, width: resizedColumn.width + dragDelta.x }));
    } 
    setResizedColumn({});
  } 

  const handleOnMouseMove = (event, column) => {
    updateDragging(event);
    if (isDragging) {
      if ((resizedColumn.width + dragDelta.x) > config.columns.minWidth) {
        dispatch(setColumnWidth({ ...resizedColumn, width: resizedColumn.width + dragDelta.x }));
      }
    }
  }

  // SYNC
  useEffect(() => {
    dispatch(syncSortingData({
      sortBy: settingsData.sortBy, 
      sortByAscending: settingsData.sortByAscending, 
      showFoldersFirst: settingsData.showFoldersFirst
    }))
  }, [settingsData.sortBy, settingsData.sortByAscending, settingsData.showFoldersFirst])


  // GETS
  const getListViewHeader = () => {
    const onColumnHeaderClick = (event, name) => {
      if (event.target === event.currentTarget) {
        if (settingsData.sortBy === name) {
          dispatch(setSortByAscending(!settingsData.sortByAscending));
        } else {
          dispatch(setSortBy(name));
        }      
      }
      
    }

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
          width: settingsData.listElementHeight * (4 / 3) + 'px',
        }} />

        {settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
          <Box className={`shrink-0 grid grid-cols-[1fr_max-content]
          border-r border-sky-300/20
          ${(isDragging && (column.name === resizedColumn.name)) ? 'static' : 'relative'}`}
          style={{
            width: column.width
          }}
          key={'header-' + column.name}
          onClick={(event) => onColumnHeaderClick(event, column.name)}>


            <Box className={`-mr-2 z-20
            cursor-col-resize
            ${(isDragging && (column.name === resizedColumn.name)) ? 'fixed h-dvh w-screen top-0 left-0 ' : 'absolute h-full w-4 right-0'}`}
            onMouseDown={(event) => handleOnMouseDown(event, column)}
            onMouseUp={handleOnMouseUp}
            onMouseMove={(event) => handleOnMouseMove(event, column)}/> {/* Used to stop resizing if mouse leaves the window */}

            <p className='w-full px-2 pointer-events-none
            text-ellipsis overflow-hidden'>
              {config.columns.displayedNames[column.name]}
            </p> 

            <ChevronDown className={`h-4 w-4 mt-2 mr-2 pointer-events-none
            ${(settingsData.sortBy === column.name) ? 'opacity-100' : 'opacity-0'}
            ${settingsData.sortByAscending ? 'rotate-180' : 'rotate-0'}`}/>

          </Box>
        )}

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

          {contextMenuContext.isCreatingFolder && (
            <FolderElement />
          )}

          <Box className={`w-full h-fit grid`}>
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

