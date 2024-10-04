import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/PathSlice';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import FolderService from 'services/FolderService.jsx';

import RenameModal from 'pages/drive/modals/RenameModal';

import { ReactComponent as Folder } from 'assets/icons/folder.svg'


export default function FolderElement ({ folder }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);
  const clipboardContext = useContext(ClipboardContext);
  const folderContext = useContext(FolderContext);
  const modalContext = useContext(ModalContext);

  if (!folder) { 
    folder = { 
      uuid: '', 
      name: '', 
      parentUuid: folderContext.currentFolder.uuid 
    } 
  }


  // GETS
  const getIsHovered = () => {
    if (clipboardContext.hoveredElement) {
      return clipboardContext.hoveredElement.uuid === folder.uuid;
    } else {
      return false;
    }
  }

  const getIsClicked = () => {
    if (clipboardContext.clickedElements.includes(folder)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsCreating = () => {
    if (clipboardContext.isCreatingFolder && (!folder.uuid)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsRenaming = () => {
    if (clipboardContext.isRenaming && clipboardContext.clickedElements.includes(folder)) {
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
        usedNames={folderContext.currentFolder.folders.map(f => f.name)}/>)
    }
  }, [getIsCreating(), getIsRenaming()])

  const stopNaming = () => {
    clipboardContext.setIsCreatingFolder(false);
    clipboardContext.setIsRenaming(false);
  }

  const handleNaming = async (name) => {
    if (name && (name !== folder.name)) {
      if (clipboardContext.isCreatingFolder) {
        await FolderService.handleCreate(userData, driveData, { ...folder, name: name })
        .then(() => {
          folderContext.reorderFolders({ ...folder, name: name });
          clipboardContext.setIsCreatingFolder(false);
          modalContext.closeModal();
        })
        .catch(() => {
          clipboardContext.setIsCreatingFolder(false);
          modalContext.closeModal();
        })
      } else {
        await FolderService.handleRename(userData, driveData, { ...folder, name: name })
        .then(() => {
          folderContext.reorderFolders({ ...folder, name: name });
          clipboardContext.setIsRenaming(false);
          modalContext.closeModal();
        })
        .catch(() => {
          clipboardContext.setIsRenaming(false);
          modalContext.closeModal();
        })
      }
    } else {
      clipboardContext.setIsCreatingFolder(false);
      clipboardContext.setIsRenaming(false);
      modalContext.closeModal();
    }
  }

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      clipboardContext.setHoveredElement({ uuid: '' });
    }
  }

  const handleOnMouseDown = (event) => {
    clipboardContext.handleMouseDown(event, folder);
  }

  const handleOnMouseEnter = () => {
    clipboardContext.setHoveredElement(folder);
  }
  
  const handleOnMouseLeave = () => {
    clipboardContext.setHoveredElement({ uuid: '' });
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
  const getNameStyle = () => {
    let res = '';
    if (getIsClicked()) {
      res = 'bg-sky-400/20';
    } else {
      if (getIsHovered()) {
        res = 'bg-sky-400/10';
      }
    } 
    return res;
  }

  const getIconStyle = () => { // Folder icon bg opacity = 0.4
    let res = '';
    if (getIsCut()) {
      res = 'opacity-25'
    } else {
      if (getIsClicked()) {
        res = 'opacity-100'
      } else {
        if (getIsHovered()) {
          res = 'opacity-75'
        } else {
          res = 'opacity-50'
        }
      }
    }  
    return res;
  }

  
  // RENDER
  if (settingsData.type === 'grid') {
    return (
      <Box className={`w-full h-full p-4 place-self-center border-box
      transition-all duration-300`}>
  
        <Box className={`w-full`}
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onContextMenu={handleOnContextMenu}
        onKeyDown={handleOnKeyDown}
        onDoubleClick={handleOnDoubleClick}>
          <Folder className={`w-full h-fit place-self-center 
          transition-all duration-300
          pointer-events-none select-none 
          ${getIconStyle()}`}/>
        </Box>
  
        <Box className='w-full pt-2 place-self-center overflow-visible'
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onContextMenu={handleOnContextMenu}
        onKeyDown={handleOnKeyDown}
        onDoubleClick={handleOnDoubleClick}>
          <p className={`w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
          select-none pointer-events-none
          transition-all duration-300
          rounded-[0.3rem] overflow-hidden max-w-32
          leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis
          ${getNameStyle()}`}>
            {folder.name}   
          </p>
        </Box>

      </Box>
    );
  } 
    
}
