import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/pathSlice';
import { createElement, renameElements } from 'state/slices/currentFolderSlice';
import { updateBookmarksOnClient, revertUpdateBookmarksOnClient } from 'state/slices/bookmarkSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import RenameModal from 'pages/drive/modals/RenameModal';

import { ReactComponent as Folder } from 'assets/icons/elements/muonium/folder.svg'


export default function FolderElement ({ folder, elementSize }) {
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
    }
  }

  const handleOnMouseDown = (event) => {
    contextMenuContext.handleOnElementMouseDown(event, folder);
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

  const getIconStyle = () => { // Folder icon bg opacity = 0.4
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

  
  // RENDER
  if (folder) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box className={`h-full p-4 place-self-center
        transition-all duration-300`}
        style={{width: elementSize ? elementSize + 'px' : ''}}>
    
          <Box className={`w-full`}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <Folder className={`w-full h-full place-self-center 
            transition-all
            pointer-events-none select-none 
            ${getIconStyle()}`}/>
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
              {folder.name}   
            </p>
          </Box>

        </Box>
      );
    } 
  }
    
}
