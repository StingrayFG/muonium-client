import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { renameElements } from 'state/slices/currentFolderSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import RenameModal from 'pages/drive/modals/RenameModal';
import ImageModal from 'pages/drive//modals/ImageModal';
import FileElementIcon from 'pages/drive/elements/FileElementIcon';

import config from 'config.json';


export default function FileElement ({ file, index }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);
  const currentFolderData = useSelector(state => state.currentFolder);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);


  // IMAGE
  const imageSrc = file.thumbnail ? 'data:image/png;base64,' + file.thumbnail : file.imageBlob


  // GETS
  const getIsHovered = () => {
    if (contextMenuContext.hoveredElement) {
      return contextMenuContext.hoveredElement.uuid === file.uuid;
    } else {
      return false;
    }
  }

  const getIsClicked = () => {
    if (contextMenuContext.clickedElements.includes(file)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsRenaming = () => {
    if (contextMenuContext.isRenaming && contextMenuContext.clickedElements.includes(file)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsCut = () => {
    return clipboardData.cutElementsUuids.includes(file.uuid);
  }


  // HANDLERS
  useEffect(() => {
    if (getIsRenaming()) {
      modalContext.openModal(<RenameModal name={file.name} setName={handleNaming} stopNaming={stopNaming} 
        usedNames={currentFolderData.files.map(f => f.name)} />)
    }
  }, [getIsRenaming()])

  const stopNaming = () => {
    modalContext.closeModal();
    contextMenuContext.setIsRenaming(false);
  }

  const handleNaming = async (name) => {
    if (name && (name !== file.name)) {
      modalContext.closeModal();
      contextMenuContext.setIsRenaming(false);

      const newFile = { ...file, name: name };
      dispatch(renameElements({ userData, driveData, elements: [newFile] }))

    } else if (name === file.name) {
      modalContext.closeModal();
      contextMenuContext.setIsRenaming(false);
    }
  }

  const handleOnMouseDown = (event) => {
    contextMenuContext.handleOnElementMouseDown(event, file, index);
  }

  const handleOnMouseEnter = () => {
    contextMenuContext.setHoveredElement(file);
  }
  
  const handleOnMouseLeave = () => {
    contextMenuContext.clearHoveredElement();
  }
  
  const handleOnContextMenu = (event) => {
    contextMenuContext.handleFileContextMenuClick(event, file);
  }

  const handleOnDoubleClick = () => {
    if (file.thumbnail || file.imageBlob) {
      modalContext.openModal(<ImageModal file={file}/>);
    }
  }


  // STYLES 
  const getNameStyle = () => {
    let res = '';
    if (getIsClicked()) {
      res = 'bg-sky-400/20 duration-0';
    } else {
      if (getIsHovered()) {
        res = 'bg-sky-400/10 duration-300';
      }
    } 
    return res;
  }

  const getIconStyle = () => { // File icon bg opacity = 0.4
    let res = '';
    if (getIsCut()) {
      res = 'opacity-25 duration-0';
    } else {
      if (getIsClicked()) {
        res = 'opacity-100 duration-0';
      } else {
        if (getIsHovered()) {
          res = 'opacity-75 duration-300';
        } else {
          res = 'opacity-50 duration-300';
        }
      }
    }  
    return res;
  }

  const getImageStyle = () => { // File icon bg opacity = 0.4
    let res = '';
    if (getIsCut()) {
      res = 'opacity-50';
    } else {
      res = 'opacity-100';
    }  
    return res;
  }

  const getRowStyle = () => { 
    let res = '';
    if (getIsClicked()) {
      res = 'bg-sky-400/20 duration-0';
    } else {
      if (getIsHovered()) {
        res = 'bg-sky-400/10 duration-300';
      } else if ((index % 2) === 1) {
        res = 'bg-neutral-950/40';
      }
    }
    return res;
  }

  const getListViewColumns = () => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const parseSize = (size) => {
      let res = '';
      if (size > Math.pow(1024, 3)) { res += (((size / Math.pow(1024, 3)) + '').slice(0.5) + ' GiB') } 
      else if (size > Math.pow(1024, 2)) { res += (((size / Math.pow(1024, 2)) + '').slice(0,5) + ' MiB') } 
      else if (size > Math.pow(1024, 1)) { res += (((size / Math.pow(1024, 1)) + '').slice(0,5) + ' KiB') } 
      else { res += (size + ' B') } 
      return res;
    }

    const parseColumnValue = (column) => {
      if ((column.name === 'creationDate') || (column.name === 'modificationDate')) {
        return new Date(file[column.name]).toLocaleString('en-GB', options);  
      } else if (column.name === 'size') {
        return parseSize(file[column.name]);
      } else if (column.name === 'type') {
        return file[column.name].charAt(0).toUpperCase() + file[column.name].slice(1);
      } else {
        return file[column.name];
      }
    }

    return (<>{
      settingsData.listViewColumns.filter(c => c.isEnabled).map(column => 
        <p className={`h-8 w-full px-2 my-auto shrink-0
        text-left  
        ${(column.name === 'name') ? 
        'text-neutral-200 flex' : 
        'text-neutral-200/60 text-ellipsis overflow-hidden break-all whitespace-nowrap'}`}
        style={{
          width: column.width
        }}
        key={file.uuid + '-' + column.name}>
          {column.name === 'name' ? 
          <>
            <span className='text-ellipsis overflow-hidden whitespace-nowrap'>
              {file.name.slice(0, -file.name.split('.').pop().length)}
            </span>
            <span>
              {file.name.split('.').pop()}
            </span>
          </>
          :
          parseColumnValue(column)}
        </p>
      )
    }</>)
  }

  
  // RENDER
  if (file) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box className={`h-full place-self-center
        transition-all duration-100`}
        style={{
          width: settingsData.gridElementWidth + 'px',
          padding: settingsData.gridElementWidth * 0.1 + 'px'
        }}> 
    
          <Box className={`w-full aspect-4-3 grid`}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            {(file.thumbnail || file.imageBlob) ? 
              <img className={`w-full h-full object-contain 
              transition-all
              ${getImageStyle()}`}
              src={imageSrc} 
              alt=''
              draggable={false} />
              :
              <Box className={`h-full place-self-center 
              transition-all
              pointer-events-none select-none 
              ${getIconStyle()}`}>
                <FileElementIcon file={file}/>
              </Box>
            }
          </Box>
    
          <Box className='w-full pt-2 place-self-center overflow-visible'
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <p className={`w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded-[0.3rem] overflow-hidden max-w-32
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis
            ${getNameStyle()}`}>
              {file.name}
            </p>
          </Box>

        </Box>
      );
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box className={`w-full flex
        transition-all duration-100
        ${getRowStyle()}`}
        style={{
          height: settingsData.listElementHeight + 'px'
        }}
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onContextMenu={handleOnContextMenu}
        onDoubleClick={handleOnDoubleClick}>
    
          <Box className={`h-full ml-2 aspect-4-3 grid`}
          style={{
            height: settingsData.listElementHeight + 'px',
            padding: settingsData.listElementHeight * 0.1 + 'px',
          }}>
            {(file.thumbnail || file.imageBlob) ? 
              <img className={`w-full h-full object-contain 
              transition-all
              ${getImageStyle()}`}
              src={imageSrc} 
              alt=''
              draggable={false} />
              :
              <Box className={`h-full place-self-center 
              transition-all
              pointer-events-none select-none 
              ${(settingsData.listElementHeight >= config.elements.listSmallIconsHeight) && getIconStyle()}`}>
                <FileElementIcon file={file} isBootstrap={!(settingsData.listElementHeight >= config.elements.listSmallIconsHeight)}/>
              </Box>
            }
          </Box>
    
          {getListViewColumns()}

        </Box>
      );
    }
  }
    
}
