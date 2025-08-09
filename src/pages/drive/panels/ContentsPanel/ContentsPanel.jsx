import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { useDragHandler } from 'hooks/UseDragHandler';
import { useIsOnMobile } from 'hooks/UseIsOnMobile';

import { setColumnWidth, setColumnPosition, setSortBy, setSortByAscending } from 'state/slices/settingsSlice';
import { syncSortingData, createElement, renameElements } from 'state/slices/currentFolderSlice';
import { updateBookmarksOnClient, revertUpdateBookmarksOnClient } from 'state/slices/bookmarkSlice';
import { moveToNew } from 'state/slices/pathSlice';

import commonUtils from 'utils/commonUtils';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx'

import FileElement from 'pages/drive/elements/FileElement/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement/FolderElement.jsx';
import RenameModal from 'pages/drive/modals/RenameModal';
import AlbumViewerModal from 'pages/drive/modals/AlbumViewerModal';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

import config from 'config.json';


export default function ContentsPanel () {
  const dispatch = useDispatch();

  const isOnMobile = useIsOnMobile();

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const currentFolderData = useSelector(state => state.currentFolder);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  const headerRef = useRef(null);
  const contentsRef = useRef(null);


  // WINDOW RESIZE
  const [gridGridColumnsCount, setGridColumnsCount] = useState(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));

  useEffect(() => {
    if (!contentsRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setGridColumnsCount(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));
    });
    resizeObserver.observe(contentsRef.current);

    return () => resizeObserver.disconnect();
  }, [settingsData.gridElementWidth, isOnMobile]);

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


  // HEADER HANDLERS
  const [dragData, dragFunctions] = useDragHandler(0);


  // COLUMN RESIZING
  const [resizedColumn, setResizedColumn] = useState(null);

  const handleOnResizeBarMouseDown = (event, column) => {
    if (event.button === 0) {
      dragFunctions.updateDeltaThreshold(0);
      dragFunctions.startDragging(event);
      setResizedColumn(column);
    }
  }

  const handleOnResizeBarMouseUp = (event) => {
    dragFunctions.stopDragging(event);
    setResizedColumn(null);
  } 

  const handleOnResizeBarMouseMove = (event) => {
    dragFunctions.updateDragging(event);
    if ((dragData.isDragging) &&
    resizedColumn &&
    (resizedColumn.width + dragData.dragDelta.x) > config.columns.minWidth) {
      dispatch(setColumnWidth({ ...resizedColumn, width: resizedColumn.width + dragData.dragDelta.x }));
    }
  }
  

  // COLUMN REPOSITIONING
  const [movedColumnData, setMovedColumnData] = useState({
    column: null,
    columnIndex: 0,
    initialOffset: 0,
    currentOffset: 0,
  })

  const getColumnOffsets = () => {
    const firstColumnOffset = (settingsData.listElementHeight * (4 / 3)) + 8;
    let currentOffset = firstColumnOffset;
    let columnOffsets = [];

    for (const column of settingsData.listViewColumns.filter(c => c.isEnabled)) {
      columnOffsets.push({
        leftOffset: currentOffset,
        rightOffset: currentOffset + column.width
      });
      currentOffset += column.width;
    }

    return columnOffsets;
  }

  const handleOnColumnHeaderMouseDown = (event, column) => {
    if ((event.target === event.currentTarget) && (event.button === 0)) {
      dragFunctions.updateDeltaThreshold(10);

      setMovedColumnData({
        column: column,
        columnIndex: settingsData.listViewColumns.filter(c => c.isEnabled).findIndex(c => c.name === column.name),
        currentOffset: event.target.offsetLeft,
        initialOffset: event.target.offsetLeft,
      })
    }
  }

  const handleOnColumnHeaderMouseUp = (event) => {
    if (!dragData.isDragging) {
      if (settingsData.sortBy === movedColumnData.column.name) {
        dispatch(setSortByAscending(!settingsData.sortByAscending));
      } else {
        dispatch(setSortBy(movedColumnData.column.name));
      }      
    }

    dragFunctions.stopDragging();
    setMovedColumnData({
      ...movedColumnData,
      column: null
    })
  }

  const handleOnColumnHeaderMouseMove = (event) => {
    dragFunctions.updateDragging(event);

    if (!dragData.isHolding) {
      dragFunctions.startDragging(event);

    } else if (dragData.isDragging) {
      setMovedColumnData({ 
        ...movedColumnData, 
        currentOffset: movedColumnData.initialOffset + dragData.dragDelta.x
      })
      const enabledColumns = settingsData.listViewColumns.filter(c => c.isEnabled);
      const columnOffsets = getColumnOffsets();
     
      if ((movedColumnData.columnIndex >= 1) &&
      (movedColumnData.currentOffset < columnOffsets[movedColumnData.columnIndex - 1].leftOffset)) {
        
        const newPosition = settingsData.listViewColumns.findIndex(c => c.name === enabledColumns[movedColumnData.columnIndex - 1].name)
        setMovedColumnData({ 
          ...movedColumnData, 
          columnIndex: enabledColumns.findIndex(c => c.name === enabledColumns[movedColumnData.columnIndex - 1].name)
        })
        dispatch(setColumnPosition({ column: movedColumnData.column, position: newPosition }));
      
      } else if ((movedColumnData.columnIndex <= enabledColumns.length - 2) && 
      (movedColumnData.currentOffset > columnOffsets[movedColumnData.columnIndex + 1].leftOffset)) {

        const newPosition = settingsData.listViewColumns.findIndex(c => c.name === enabledColumns[movedColumnData.columnIndex + 1].name)
        setMovedColumnData({ 
          ...movedColumnData, 
          columnIndex: enabledColumns.findIndex(c => c.name === enabledColumns[movedColumnData.columnIndex + 1].name)
        })
        dispatch(setColumnPosition({ column: movedColumnData.column, position: newPosition }));
      }
    }
  } 

  
  // ELEMENT FUNCTIONS
  useEffect(() => {
    if (contextMenuContext.isRenaming || contextMenuContext.isCreatingFolder) {
      if (contextMenuContext.selectedElements.length > 0) {
        modalContext.openModal(<RenameModal 
        name={contextMenuContext.selectedElements[0].name} 
        setName={handleNaming} 
        stopNaming={stopNaming} 
        usedNames={[ 
          ...currentFolderData.folders.map(f => f.name),
          ...currentFolderData.files.map(f => f.name),
        ]}/>)
      } else {
        modalContext.openModal(<RenameModal 
        name={''} 
        setName={handleNaming} 
        stopNaming={stopNaming} 
        usedNames={[ 
          ...currentFolderData.folders.map(f => f.name),
          ...currentFolderData.files.map(f => f.name),
        ]}/>)
      }
      
    }
  }, [contextMenuContext.isCreatingFolder, contextMenuContext.isRenaming])

  const stopNaming = () => {
    contextMenuContext.setIsCreatingFolder(false);
    contextMenuContext.setIsRenaming(false);
  }

  const handleNaming = async (name) => {
    if ((contextMenuContext.selectedElements.length === 0) || 
    (name && (name !== contextMenuContext.selectedElements[0].name))) {
      modalContext.closeNextModal();

      if (contextMenuContext.isCreatingFolder) {
        contextMenuContext.setIsCreatingFolder(false);

        const newFolder = { uuid: 'temp-' + Date.now(), name: name, type: 'folder', parentUuid: currentFolderData.uuid };
        dispatch(createElement({ userData, driveData, element: newFolder }))

        contextMenuContext.addSelectedElement(null, newFolder);
      } else {
        contextMenuContext.setIsRenaming(false);

        const newElement = { ...contextMenuContext.selectedElements[0], name: name };
        dispatch(updateBookmarksOnClient([{
          uuid: userData.uuid + newElement.uuid,
          folder: newElement
        }]))
        dispatch(renameElements({userData, driveData, elements: [newElement] }))
        .then(res => {
          if (res.type === 'elements/rename/rejected') {
            dispatch(revertUpdateBookmarksOnClient([{
              uuid: userData.uuid + newElement.uuid,
              folder: newElement
            }]))
          }
        })

        contextMenuContext.updateSelectedElement(newElement)
      }

    } else if (name === contextMenuContext.selectedElements[0].name) {
      modalContext.closeNextModal();
      contextMenuContext.setIsRenaming(false);
    }
  }

  const handleOpenFile = (element) => {
    if (['image', 'video', 'audio'].includes(commonUtils.getFileTypeFromName(element.name)) && !element.isRemoved) {
      modalContext.openModal(<AlbumViewerModal 
      initialFile={element}
      allFiles={currentFolderData.sortedElements
      .filter(e => e.type === 'file')
      .filter(e => [commonUtils.getFileTypeFromName(element.name)].includes(commonUtils.getFileTypeFromName(e.name)))}/>);
    }
  } 

  const handleOnElementMouseDown = (event, element, index) => {
    if (isOnMobile) { 
      if (contextMenuContext.selectedElements.length === 0) {
        if (element.type === 'file') {
          handleOpenFile(element);
        } else if ((element.type === 'folder') && !element.isRemoved) {
          dispatch(moveToNew({ uuid: element.uuid }));
        }
      } else {
        if (!contextMenuContext.selectedElements.map(e => e.uuid).includes(element.uuid)) {
          contextMenuContext.setSelectedElements([ ...contextMenuContext.selectedElements, element])
        } else {
          contextMenuContext.setSelectedElements([ ...contextMenuContext.selectedElements.filter(e => e.uuid !== element.uuid) ])
        }
      }
    } else {
      // Selection with shift
      if ((event.button === 0) && 
      event.shiftKey && 
      !contextMenuContext.isContextMenuOpen && 
      (contextMenuContext.selectedElements.length > 0) && 
      !contextMenuContext.selectedElements.includes(element)) {
        const firstElementIndex = currentFolderData.sortedElements.indexOf(contextMenuContext.selectedElements[0]);

        if (index < firstElementIndex) {
          contextMenuContext.setSelectedElements([ 
            contextMenuContext.selectedElements[0],
            ...currentFolderData.sortedElements.slice(index, firstElementIndex) 
          ])
        } else if (index > firstElementIndex) {
          contextMenuContext.setSelectedElements([ 
            contextMenuContext.selectedElements[0], 
            ...currentFolderData.sortedElements.slice(firstElementIndex + 1, index + 1) 
          ])
        }

      } else if ((event.button === 0) && 
      !contextMenuContext.isContextMenuOpen && 
      !contextMenuContext.selectedElements.map(e => e.uuid).includes(element.uuid)) {
        contextMenuContext.addSelectedElement(event, element); // Will get added or appended depending on the ctrl key
      }
    }
  };

  const handleOnElementDoubleClick = (event, element) => {
    if (!isOnMobile) {
      if (element.type === 'file') {
        handleOpenFile(element);
      } else if ((element.type === 'folder') && !element.isRemoved) {
        dispatch(moveToNew({ uuid: element.uuid }));
        contextMenuContext.clearSelectedElements();
      }
    } 
  };  
  
  const handleOnElementContextMenu = (event, element) => {
    if (isOnMobile) {
      if (contextMenuContext.selectedElements.map(e => e.uuid).includes(element.uuid)) {
        if (element.type === 'file') {
          contextMenuContext.handleFileContextMenuClick(event, element);
        } else if (element.type === 'folder') {
          contextMenuContext.handleFolderContextMenuClick(event, element);
        }
      } else {
        contextMenuContext.setSelectedElements([ ...contextMenuContext.selectedElements, element])
      }
    } else {
      if (element.type === 'file') {
        contextMenuContext.handleFileContextMenuClick(event, element);
      } else if (element.type === 'folder') {
        contextMenuContext.handleFolderContextMenuClick(event, element);
      }
    }
  };

  const handleOnPanelContextMenu = (event) => {
    if (event.target.id === 'contents-box') {
      contextMenuContext.handleDefaultContextMenuClick(event);
    }
  }

  
  // HEADER
  const getHeaderRowColumns = () => {
    return (
      <Box className={`h-8 w-full absolute top-0 flex
      overflow-x-auto scrollbar-hidden
      border-b border-sky-300/20 bg-neutral-950/60`}
      ref={headerRef}
      onContextMenu={contextMenuContext.handleColumnsContextMenuClick}>

        {/* Offset box */}
        {/* MUI Box has a bug, which results in shrinking animation that is impossible to disable, so a div is used */}
        <div className={`ml-2 shrink-0
        border-r border-sky-300/20`}
        style={{
          width: settingsData.listElementHeight * (4 / 3) + 'px',
        }} />

        {/* Columns */}
        {settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
          <Box className={`shrink-0 
          grid grid-cols-[1fr_max-content]
          transition-all duration-300 hover:duration-0
          border-r border-sky-300/20 hover:bg-sky-400/10   
          ${(dragData.isDragging && (column.name === resizedColumn?.name)) ? 'static' : 'relative'}
          ${(column.name === movedColumnData.column?.name) ? 'bg-sky-400/10' : 'bg-transparent'}`}
          style={{
            width: column.width
          }}
          key={'header-' + column.name}
          onMouseDown={(event) => handleOnColumnHeaderMouseDown(event, column)}>

            {/* Resize bar / resizing lock box */}
            <Box className={`-mr-2 z-10
            cursor-col-resize
            ${(dragData.isDragging && (column.name === resizedColumn?.name)) ? 'fixed h-dvh w-screen top-0 left-0 ' : 'absolute h-full w-4 right-0'}`}
            onMouseDown={(event) => handleOnResizeBarMouseDown(event, column)}
            onMouseUp={handleOnResizeBarMouseUp}
            onMouseMove={handleOnResizeBarMouseMove}/> {/* Used to stop resizing if mouse leaves the window */}

            <p className='w-full my-auto px-2 pointer-events-none
            text-ellipsis overflow-hidden'>
              {config.columns.displayedNames[column.name]}
            </p> 

            <ChevronDown className={`h-4 w-4 mt-2 mr-2 pointer-events-none
            ${(settingsData.sortBy === column.name) ? 'opacity-100' : 'opacity-0'}
            ${settingsData.sortByAscending ? 'rotate-180' : 'rotate-0'}`}/>

          </Box>
        )}

        {/* Repositioning lock box */}
        {movedColumnData.column && 
          <Box className={`fixed h-dvh w-screen top-0 left-0 z-20`}
          onMouseUp={handleOnColumnHeaderMouseUp}
          onMouseMove={handleOnColumnHeaderMouseMove} />
        }

        {/* Column ghost */}
        {(dragData.isDragging && movedColumnData.column) && 
          <Box className={`shrink-0 absolute z-10
          grid grid-cols-[1fr_max-content]
          animate-fadein-custom-150 animate-fadeout-custom-150
          bg-gray-700/80`}
          style={{
            width: movedColumnData.column.width + 'px',
            transform: `translateX(${movedColumnData.currentOffset}px)`
          }}
          key={'header-' + movedColumnData.column.name}>

            <p className='w-full px-2 py-1 pointer-events-none
            text-ellipsis overflow-hidden'>
              {config.columns.displayedNames[movedColumnData.column.name]}
            </p> 

            <ChevronDown className={`h-4 w-4 mt-2 mr-2 pointer-events-none
            ${(settingsData.sortBy === movedColumnData.column.name) ? 'opacity-100' : 'opacity-0'}
            ${settingsData.sortByAscending ? 'rotate-180' : 'rotate-0'}`}/>

          </Box>
        }
      </Box>
    )
  }

  // ELEMENT GETS
  const getElementRowColumns = (element) => {
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const parseColumnValue = (column) => {
      if (['creationDate', 'modificationDate'].includes(column.name)) {
        return new Date(element[column.name]).toLocaleString('en-GB', dateOptions);  

      } else if (column.name === 'size') {
        if (element.type === 'folder') {
          return element[column.name] + (element[column.name] === 1 ? ' item' : ' items');
        } else if (element.type === 'file') {
          return commonUtils.parseFileSizeToString(element.size)
        }

      } else if (column.name === 'type') {
        return element[column.name].charAt(0).toUpperCase() + element[column.name].slice(1);

      } else {
        return element[column.name];
      }
    }

    return settingsData.listViewColumns.filter(c => c.isEnabled).map(column => ({
      name: column.name,
      value: parseColumnValue(column),
      width: column.width
    }))
  }

  const getElementBoxStyle = (element) => {
    let res = 'w-[${settingsData.gridElementWidth * 0.8}px] m-[${settingsData.gridElementWidth * 0.1}px] ';
    if (clipboardData.cutElementsUuids.includes(element.uuid)) {
      res = 'element-box-cut';
    } else if (contextMenuContext.selectedElements.map(e => e.uuid).includes(element.uuid)) {
      res = 'element-box-clicked';
    } else {
      res = 'element-box';
    } 
    return res;
  }

  const getElementRowStyle = (element) => {
    let res = 'w-[${settingsData.gridElementWidth * 0.8}px] m-[${settingsData.gridElementWidth * 0.1}px] ';
    if (clipboardData.cutElementsUuids.includes(element.uuid)) {
      res += 'element-row-cut';
    } else if (contextMenuContext.selectedElements.map(e => e.uuid).includes(element.uuid)) {
      res += 'element-row-clicked';
    } else {
      res += 'element-row';
    }
    return res;
  }

  const getElementRowBackground = (index) => {
    if ((index % 2) === 1) {
      return <Box className='w-full h-full absolute z-[-10] bg-neutral-950/40' />
    }
  }

  const getElementGeneratedData = (element, index) => {
    return {
      boxStyle: getElementBoxStyle(element),
      boxWidth: settingsData.gridElementWidth,
      boxPadding: settingsData.gridElementWidth * 0.1,

      rowStyle: getElementRowStyle(element),
      rowHeight: settingsData.listElementHeight,
      rowPadding: settingsData.listElementHeight * 0.1,
      rowBackground: getElementRowBackground(index),
      rowColumns: getElementRowColumns(element),
      rowShouldUseSmallIcon: (settingsData.listElementHeight <= config.elements.listSmallIconsHeight),
    }
  }

  const getFileThumbnailLink = (file) => {
    if (file.thumbnail) {
      return 'data:image/png;base64,' + file.thumbnail;
    } else if (file.fileBlob && ['image'].includes(commonUtils.getFileTypeFromName(file.name))) {
      return file.fileBlob;
    } else {
      return null;
    }
  }

  // ELEMENT PROPS
  const getCommonElementProps = () => {
    return {
      viewMode: settingsData.viewMode,
      handleOnElementMouseDown,
      handleOnElementContextMenu,
      handleOnElementDoubleClick
    }
  }

  const getFileProps = (file, index) => {
    return {
      generatedData: {
        type: commonUtils.getFileTypeFromName(file.name),
        thumbnailLink: getFileThumbnailLink(file),
        ...getElementGeneratedData(file, index),
      },
      ...getCommonElementProps()
    }
  }

  const getFolderProps = (folder, index) => {
    return {
      generatedData: getElementGeneratedData(folder, index),
      ...getCommonElementProps()
    }
  }
  
  // RENDER
  const getNewFolder = () => {
    return {
      uuid: '', 
      name: '',
      type: 'folder', 
      parentUuid: currentFolderData.uuid 
    }
  }

  if (settingsData.viewMode === 'grid') {
    return (
      <Box className={`w-full
      shrink-0 grow
      overflow-hidden relative
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={contextMenuContext.handleOnWrapMouseDown}
      onContextMenu={handleOnPanelContextMenu}>

        <Box id={'contents-box'}
        className={`w-full h-full
        overflow-y-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}>

          <Box id={'contents-box'}
          className={`w-full h-fit 
          grid place-items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridGridColumnsCount}, minmax(0, 1fr))`,
            paddingTop: settingsData.gridElementWidth * 0.1,
            paddingBottom: settingsData.gridElementWidth * 0.1
          }}>

            {contextMenuContext.isCreatingFolder && 
              <FolderElement 
              index={0}
              folder={getNewFolder()}
              { ...getFolderProps(getNewFolder(), 0) } />
            }
      
            {currentFolderData.sortedElements.map((element, index) => {
              if (element.type === 'folder') {
                return (
                  <FolderElement key={element.uuid}
                  index={index}
                  folder={element} 
                  { ...getFolderProps(element, index) } />
                )
              } else if (element.type === 'file') {
                return (
                  <FileElement key={element.uuid} 
                  index={index}
                  file={element} 
                  { ...getFileProps(element, index) } />
                )
              }
            })} 

          </Box> 

        </Box> 

      </Box> 
    ) 
  } else if (settingsData.viewMode === 'list') {
    return (
  
      <Box className={`w-full h-full pt-8 
      shrink-0 grow
      overflow-hidden relative
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={contextMenuContext.handleOnWrapMouseDown}
      onContextMenu={handleOnPanelContextMenu}>

        {getHeaderRowColumns()}

        <Box id={'contents-box'}
        className={`w-full h-full
        overflow-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}
        onScroll={handleOnScroll}>
          
          <Box id={'contents-box'}
          className={`w-full h-fit grid`}>
            {contextMenuContext.isCreatingFolder && (
              <FolderElement 
              index={0}
              folder={getNewFolder()}
              { ...getFolderProps(getNewFolder(), 0) } />
            )}

            {(currentFolderData.sortedElements.length) > 0 && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid}
                    index={index}
                    folder={element} 
                    { ...getFolderProps(element, index) } />
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    index={index}
                    file={element} 
                    { ...getFileProps(element, index) } />
                  )
                }
              })}
            </>}
          </Box>  

        </Box>  

      </Box>
    )  
  }
}

