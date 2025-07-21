import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { setColumnWidth, setColumnPosition, setSortBy, setSortByAscending } from 'state/slices/settingsSlice';
import { syncSortingData, createElement, renameElements } from 'state/slices/currentFolderSlice';
import { updateBookmarksOnClient, revertUpdateBookmarksOnClient } from 'state/slices/bookmarkSlice';
import { moveToNew } from 'state/slices/pathSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx'

import { useDragHandler } from 'hooks/UseDragHandler';

import FileElement from 'pages/drive/elements/FileElement/FileElement.jsx';
import FolderElement from 'pages/drive/elements/FolderElement/FolderElement.jsx';
import RenameModal from 'pages/drive/modals/RenameModal';
import AlbumViewerModal from 'pages/drive/modals/AlbumViewerModal';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron-down.svg';

import config from 'config.json';
import extensions from 'extensions.json';


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


  const getNewFolder = () => {
    return {
      uuid: '', 
      name: '',
      type: 'folder', 
      parentUuid: currentFolderData.uuid 
    }
  }


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


  // HEADER HANDLERS
  const [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging, updateDelta] = useDragHandler(0);

  const [gridGridColumnsCount, setGridColumnsCount] = useState(Math.floor(contentsRef?.current?.clientWidth / settingsData.gridElementWidth));

  const [resizedColumn, setResizedColumn] = useState({});
  const [movedColumn, setMovedColumn] = useState({});
  const [movedColumnInitialOffset, setMovedColumnInitialOffset] = useState(0);
  const [movedColumnOffset, setMovedColumnOffset] = useState(0);
  const [movedColumnIndex, setMovedColumnIndex] = useState({});

  const [columnsOffsets, setColumnsOffsets] = useState([]);

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
        modalContext.openModal(<RenameModal 
        name={contextMenuContext.clickedElements[0].name} 
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
    if ((contextMenuContext.clickedElements.length === 0) || 
    (name && (name !== contextMenuContext.clickedElements[0].name))) {
      modalContext.closeNextModal();

      if (contextMenuContext.isCreatingFolder) {
        contextMenuContext.setIsCreatingFolder(false);

        const newFolder = { uuid: 'temp-' + Date.now(), name: name, type: 'folder', parentUuid: currentFolderData.uuid };
        dispatch(createElement({ userData, driveData, element: newFolder }))

        contextMenuContext.addClickedElement(null, newFolder);
      } else {
        contextMenuContext.setIsRenaming(false);

        const newElement = { ...contextMenuContext.clickedElements[0], name: name };
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

        contextMenuContext.updateClickedElement(newElement)
      }

    } else if (name === contextMenuContext.clickedElements[0].name) {
      modalContext.closeNextModal();
      contextMenuContext.setIsRenaming(false);
    }
  }

  const handleOnElementMouseDown = (event, element, index) => {
    if (contextMenuContext.getIsOnMobile()) { 
      if (contextMenuContext.clickedElements.length === 0) {
        if (element.type === 'file') {
          if (element.thumbnail || element.imageBlob) {
            modalContext.openModal(<AlbumViewerModal 
            initialFile={element}
            allFiles={currentFolderData.sortedElements.filter(e => (e.thumbnail || e.imageBlob))}/>);
          }
        } else if (element.type === 'folder') {
          if (!element.isRemoved) {
            dispatch(moveToNew({ uuid: element.uuid }));
          }
        }
      } else {
        if (!contextMenuContext.clickedElements.map(e => e.uuid).includes(element.uuid)) {
          contextMenuContext.setClickedElements([ ...contextMenuContext.clickedElements, element])
        } else {
          contextMenuContext.setClickedElements([ ...contextMenuContext.clickedElements.filter(e => e.uuid !== element.uuid) ])
        }
      }
    } else {
      if ((event.button === 0) && 
      event.shiftKey && 
      !contextMenuContext.isContextMenuOpen && 
      (contextMenuContext.clickedElements.length > 0) && 
      !contextMenuContext.clickedElements.includes(element)) {
        const firstElementIndex = currentFolderData.sortedElements.indexOf(contextMenuContext.clickedElements[0]);

        if (index < firstElementIndex) {
          contextMenuContext.setClickedElements([ contextMenuContext.clickedElements[0], ...currentFolderData.sortedElements.slice(index, firstElementIndex) ])
        } else if (index > firstElementIndex) {
          contextMenuContext.setClickedElements([ contextMenuContext.clickedElements[0], ...currentFolderData.sortedElements.slice(firstElementIndex + 1, index + 1) ])
        }

      } else if ((event.button === 0) && 
      !contextMenuContext.isContextMenuOpen && 
      !contextMenuContext.clickedElements.map(e => e.uuid).includes(element.uuid)) {
        contextMenuContext.addClickedElement(event, element); // Will get added or appended depending on the ctrl key
      }
    }
  };

  const handleOnElementDoubleClick = (event, element, index) => {
    if (!contextMenuContext.getIsOnMobile()) {
      if (element.type === 'file') {
        if (element.thumbnail || element.imageBlob) {
          modalContext.openModal(<AlbumViewerModal 
          initialFile={element}
          allFiles={currentFolderData.sortedElements.filter(e => (e.thumbnail || e.imageBlob))}/>);
        }
      } else if (element.type === 'folder') {
        if (!element.isRemoved) {
          dispatch(moveToNew({ uuid: element.uuid }));
          contextMenuContext.clearClickedElements();
        }
      }
    } 
  };  
  
  const handleOnElementContextMenu = (event, element, index) => {
    if (contextMenuContext.getIsOnMobile()) {
      if (contextMenuContext.clickedElements.map(e => e.uuid).includes(element.uuid)) {
        if (element.type === 'file') {
          contextMenuContext.handleFileContextMenuClick(event, element);
        } else if (element.type === 'folder') {
          contextMenuContext.handleFolderContextMenuClick(event, element);
        }
      } else {
        contextMenuContext.setClickedElements([ ...contextMenuContext.clickedElements, element])
      }
    } else {
      if (element.type === 'file') {
        contextMenuContext.handleFileContextMenuClick(event, element);
      } else if (element.type === 'folder') {
        contextMenuContext.handleFolderContextMenuClick(event, element);
      }
    }
  };

  const clickableElementBoxesIds = ['folder-icon-box', 'folder-name-box', 'folder-row-box', 'file-icon-box', 'file-name-box', 'file-row-box'];

  const handleOnPanelContextMenu = (event) => {
    if (!clickableElementBoxesIds.includes(event.target.id) && contextMenuContext.getIsOnMobile()) {
      contextMenuContext.handleDefaultContextMenuClick(event);
    } else if (!contextMenuContext.getIsOnMobile()) { 
      contextMenuContext.handleDefaultContextMenuClick(event);
    }
  }

  
  // GETS
  const getParsedFileSize = (size) => {
    let res = '';
    if (size > Math.pow(1024, 3)) { res += (((size / Math.pow(1024, 3)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 3)) + '').length + 2) + ' GiB') } 
    else if (size > Math.pow(1024, 2)) { res += (((size / Math.pow(1024, 2)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 2)) + '').length + 2) + ' MiB') } 
    else if (size > Math.pow(1024, 1)) { res += (((size / Math.pow(1024, 1)) + '')
      .slice(0, (Math.floor(size / Math.pow(1024, 1)) + '').length + 2) + ' KiB') } 
    else { res += (size + ' B') } 
    return res;
  }

  const getHeaderRowColumns = () => {
    return (
      <Box className={`h-8 w-full absolute top-0 flex
      transition-opacity duration-0
      overflow-x-auto scrollbar-hidden
      border-b border-sky-300/20 bg-gray-900/40 shadow-md
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      ref={headerRef}
      onContextMenu={contextMenuContext.handleColumnsContextMenuClick}>

        {/* MUI Box has a bug, which results in shrinking animation that is impossible to disable, so a div is used */}
        <div className={`ml-2 shrink-0
        transition-all duration-0
        border-r border-sky-300/20`}
        style={{
          width: settingsData.listElementHeight * (7 / 3) + 'px',
        }} />

        {settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
          <Box className={`shrink-0 
          grid grid-cols-[1fr_max-content]
          transition-all duration-300 hover:duration-0
          border-r border-sky-300/20 hover:bg-sky-400/10   
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

            <p className='w-full my-auto px-2 pointer-events-none
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

  // ELEMENT GETS
  const getElementRowColumns = (element) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const parseColumnValue = (column) => {
      if ((column.name === 'creationDate') || (column.name === 'modificationDate')) {
        return new Date(element[column.name]).toLocaleString('en-GB', options);  
      } else if (column.name === 'size') {
        if (element.type === 'folder') {
          if (element[column.name] === 1) {
            return element[column.name] + ' item';
          } else if ((element[column.name] === 0) || (element[column.name] > 1)) {
            return element[column.name] + ' items';
          } else {
            return '';
          }
        } else if (element.type === 'file') {
          return getParsedFileSize(element.size)
        }
      } else if (column.name === 'type') {
        return element[column.name].charAt(0).toUpperCase() + element[column.name].slice(1);
      } else {
        return element[column.name];
      }
    }

    return (<>{
      settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
        <p data-testid={'element-column'}
        className={`h-8 w-full py-1 px-2 my-auto 
        shrink-0
        pointer-events-none
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

  const getFileType = (file) => {
    const ext = (file.name.split('.').pop()).toLowerCase();

    if (extensions.text.includes(ext)) { return 'text' } 
    else if (extensions.audio.includes(ext)) { return 'audio'} 
    else if (extensions.image.includes(ext)) { return 'image'} 
    else if (extensions.video.includes(ext)) { return 'video'  } 
    else if (extensions.archive.includes(ext)) { return 'archive' } 
    else if (extensions.app.includes(ext)) { return 'app' } 
    else { return 'unknown' };
  }

  const getFileThumbnailLink = (file) => {
    if (file.thumbnail) {
      return 'data:image/png;base64,' + file.thumbnail;
    } else if (file.imageBlob) {
      return file.imageBlob;
    }
  }

  const getElementBoxStyle = (element) => {
    let res = 'w-[${settingsData.gridElementWidth * 0.8}px] m-[${settingsData.gridElementWidth * 0.1}px] ';
    if (clipboardData.cutElementsUuids.includes(element.uuid)) {
      res = 'element-box-cut';
    } else if (contextMenuContext.clickedElements.map(e => e.uuid).includes(element.uuid)) {
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
    } else if (contextMenuContext.clickedElements.map(e => e.uuid).includes(element.uuid)) {
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

  const getFileGeneratedData = (element, index) => {
    return {
      type: getFileType(element),
      thumbnailLink: getFileThumbnailLink(element),

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

  const getFolderGeneratedData = (element, index) => {
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

  
  // RENDER
  if (settingsData.viewMode === 'grid') {
    return (

      <Box className={`w-full
      shrink-0 grow
      shadow-md
      overflow-hidden relative
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={contextMenuContext.handleOnWrapMouseDown}
      onContextMenu={handleOnPanelContextMenu}>

        <Box className={`w-full h-full
        overflow-y-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}>

          <Box className={`w-full h-fit 
          grid place-items-center`}
          style={{
            gridTemplateColumns: `repeat(${gridGridColumnsCount}, minmax(0, 1fr))`
          }}>

            {contextMenuContext.isCreatingFolder && (
              <FolderElement 
              index={0}
              folder={getNewFolder()}
              generatedData={getFolderGeneratedData(getNewFolder(), 0)} 
              viewMode={settingsData.viewMode}
              handleOnElementMouseDown={handleOnElementMouseDown}
              handleOnElementContextMenu={handleOnElementContextMenu}
              handleOnElementDoubleClick={handleOnElementDoubleClick}/>
            )}
      
            {(currentFolderData.sortedElements.length > 0) && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid}
                    index={index}
                    folder={element} 
                    generatedData={getFolderGeneratedData(element, index)}
                    viewMode={settingsData.viewMode}
                    handleOnElementMouseDown={handleOnElementMouseDown}
                    handleOnElementContextMenu={handleOnElementContextMenu}
                    handleOnElementDoubleClick={handleOnElementDoubleClick}/>
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    index={index}
                    file={element} 
                    generatedData={getFileGeneratedData(element, index)}
                    viewMode={settingsData.viewMode}
                    handleOnElementMouseDown={handleOnElementMouseDown}
                    handleOnElementContextMenu={handleOnElementContextMenu}
                    handleOnElementDoubleClick={handleOnElementDoubleClick}/>
                  )
                }
              })}
            </>}

          </Box> 

        </Box> 

      </Box> 

    ) 

  } else if (settingsData.viewMode === 'list') {
    return (
  
      <Box className={`w-full h-full pt-8 
      shrink-0 grow
      shadow-md
      overflow-hidden relative
      transition-opacity duration-300
      ${currentFolderData.uuid ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={contextMenuContext.handleOnWrapMouseDown}
      onContextMenu={handleOnPanelContextMenu}>

        {getHeaderRowColumns()}

        <Box className={`w-full h-full
        overflow-auto 
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent`}
        ref={contentsRef}
        onScroll={handleOnScroll}
        onContextMenu={contextMenuContext.handleOnPanelContextMenu}>
          
          
          <Box className={`w-full h-fit grid`}>
            {contextMenuContext.isCreatingFolder && (
              <FolderElement isCreating={true}/>
            )}

            {(currentFolderData.sortedElements.length) > 0 && <>
              {currentFolderData.sortedElements.map((element, index) => {
                if (element.type === 'folder') {
                  return (
                    <FolderElement key={element.uuid}
                    index={index}
                    folder={element} 
                    generatedData={getFolderGeneratedData(element, index)}
                    viewMode={settingsData.viewMode}
                    handleOnElementMouseDown={handleOnElementMouseDown}
                    handleOnElementContextMenu={handleOnElementContextMenu}
                    handleOnElementDoubleClick={handleOnElementDoubleClick}/>
                  )
                } else if (element.type === 'file') {
                  return (
                    <FileElement key={element.uuid} 
                    index={index}
                    file={element} 
                    generatedData={getFileGeneratedData(element, index)}
                    viewMode={settingsData.viewMode}
                    handleOnElementMouseDown={handleOnElementMouseDown}
                    handleOnElementContextMenu={handleOnElementContextMenu}
                    handleOnElementDoubleClick={handleOnElementDoubleClick}/>
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

