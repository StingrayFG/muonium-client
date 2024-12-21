import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/pathSlice';
import { createElement, renameElements } from 'state/slices/currentFolderSlice';
import { updateBookmarksOnClient, revertUpdateBookmarksOnClient } from 'state/slices/bookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import RenameModal from 'pages/drive/modals/RenameModal';

import { ReactComponent as FolderMu } from 'assets/icons/elements/muonium/folder.svg'
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg'

import config from 'config.json';


export default function FolderElement ({ folder, index }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);
  const currentFolderData = useSelector(state => state.currentFolder);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);

  if (!folder) { 
    folder = { 
      uuid: '', 
      name: '',
      type: 'folder', 
      parentUuid: currentFolderData.uuid 
    } 
  }


  // GETS
  const getIsHovered = () => {
    if (contextMenuContext.hoveredElement) {
      return contextMenuContext.hoveredElement.uuid === folder.uuid;
    } else {
      return false;
    }
  }

  const getIsClicked = () => {
    if (contextMenuContext.clickedElements.includes(folder)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsCreating = () => {
    if (contextMenuContext.isCreatingFolder && (!folder.uuid)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsRenaming = () => {
    if (contextMenuContext.isRenaming && contextMenuContext.clickedElements.includes(folder)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsCut = () => {
    return clipboardData.cutElementsUuids.includes(folder.uuid);
  }


  // HANDLERS
  useEffect(() => {
    if (getIsRenaming() || getIsCreating()) {
      modalContext.openModal(<RenameModal name={folder.name} setName={handleNaming} stopNaming={stopNaming} 
        usedNames={currentFolderData.folders.map(f => f.name)}/>)
    }
  }, [getIsCreating(), getIsRenaming()])

  const stopNaming = () => {
    contextMenuContext.setIsCreatingFolder(false);
    contextMenuContext.setIsRenaming(false);
  }

  const handleNaming = async (name) => {
    if (name && (name !== folder.name)) {
      modalContext.closeModal();

      if (contextMenuContext.isCreatingFolder) {
        contextMenuContext.setIsCreatingFolder(false);
        const newFolder = { ...folder, uuid: 'temp-' + Date.now(), name: name };
        dispatch(createElement({ userData, driveData, element: newFolder }))
      } else {
        contextMenuContext.setIsRenaming(false);
        const newFolder = { ...folder, name: name };
        dispatch(updateBookmarksOnClient([{
          uuid: userData.uuid + newFolder.uuid,
          folder: newFolder
        }]))
        dispatch(renameElements({ userData, driveData, elements: [newFolder] }))
        .then(res => {
          if (res.type === 'elements/rename/rejected') {
            dispatch(revertUpdateBookmarksOnClient([{
              uuid: userData.uuid + newFolder.uuid,
              folder: newFolder
            }]))
          }
        })
      }

    } else if (name === folder.name) {
      modalContext.closeModal();
      contextMenuContext.setIsRenaming(false);
    }
  }

  const handleOnMouseDown = (event) => {
    contextMenuContext.handleOnElementMouseDown(event, folder, index);
  }

  const handleOnMouseEnter = () => {
    contextMenuContext.setHoveredElement(folder);
  }
  
  const handleOnMouseLeave = () => {
    contextMenuContext.clearHoveredElement();
  }
  
  const handleOnContextMenu = (event) => {
    contextMenuContext.handleFolderContextMenuClick(event, folder);
  }

  const handleOnDoubleClick = () => {
    if (!folder.isRemoved) {
      dispatch(moveToNew({ uuid: folder.uuid }));
    }
  }
  

  // STYLES 
  const getIconStyle = () => { // Folder icon bg opacity = 0.4
    let res = '';
    if (getIsCut()) {
      res = 'opacity-25 duration-0';
    } else {
      if (getIsClicked()) {
        res = 'opacity-100 duration-0';
      } else {
        if (getIsHovered()) {
          res = 'opacity-75 duration-0';
        } else {
          res = 'opacity-50 duration-300';
        }
      }
    }  
    return res;
  }

  const getNameStyle = () => {
    let res = '';
    if (getIsClicked()) {
      res = 'bg-sky-400/20 duration-0';
    } else {
      if (getIsHovered()) {
        res = 'bg-sky-400/10 duration-0';
      } else {
        res = 'duration-300';
      }
    } 
    return res;
  }

  const getRowStyle = () => { 
    let res = '';
    if (getIsClicked()) {
      res = 'bg-sky-400/20 duration-0';
    } else {
      if (getIsHovered()) {
        res = 'bg-sky-400/10 duration-0';
      } else {
        if ((index % 2) === 1) {
          res = 'bg-neutral-950/40 duration-300';
        } else {
          res = 'duration-300';
        }
        
      }
    }
    return res;
  }

  const getListViewColumns = () => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const parseColumnValue = (column) => {
      if ((column.name === 'creationDate') || (column.name === 'modificationDate')) {
        return new Date(folder[column.name]).toLocaleString('en-GB', options);  
      } else if (column.name === 'size') {
        if (folder[column.name] === 1) {
          return folder[column.name] + ' item';
        } else if ((folder[column.name] === 0) || (folder[column.name] > 1)) {
          return folder[column.name] + ' items';
        } else {
          return '';
        }
      } else if (column.name === 'type') {
        return folder[column.name].charAt(0).toUpperCase() + folder[column.name].slice(1);
      } else {
        return folder[column.name];
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
        key={folder.uuid + '-' + column.name}>
          {parseColumnValue(column)}
        </p>
      )
    }</>)
  }


  // RENDER
  if (folder) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box data-testid='folder-element'
        className={`h-full place-self-center
        transition-all duration-300`}
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
            <FolderMu data-testid='folder-icon'
            className={`w-full h-full place-self-center 
            transition-opacity
            pointer-events-none select-none 
            ${getIconStyle()}`}/>
          </Box>
    
          <Box className='w-full pt-2 place-self-center overflow-visible'
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <p data-testid='folder-name'
            className={`w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded-[0.3rem] overflow-hidden max-w-32
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis
            ${getNameStyle()}`}>
              {folder.name}   
            </p>
          </Box>

        </Box>
      );
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box data-testid='folder-element'
        className={`w-full
        transition-all duration-100
        ${getRowStyle()}`}
        style={{
          height: settingsData.listElementHeight + 'px'
        }}>

          <Box className='w-fit flex'
          style={{
            marginLeft: settingsData.listElementHeight + 'px'
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
            {(settingsData.listElementHeight >= config.elements.listSmallIconsHeight) ?
              <FolderMu data-testid='folder-icon'
              className={`w-full h-full
              transition-opacity
              pointer-events-none select-none 
              ${getIconStyle()}`}/>
              :
              <FolderBs data-testid='folder-icon'
              className={`w-full h-full
              transition-opacity
              pointer-events-none select-none`}/>
            }
            </Box>
    
            {getListViewColumns()}

          </Box>

        </Box>
      );
    }
  }
    
}
