import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';

import { moveToNew } from 'state/slices/PathSlice';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { FolderContext } from 'contexts/FolderContext.jsx';

import FolderService from 'services/FolderService.jsx';

import { ReactComponent as Folder } from 'assets/icons/folder.svg'


export default function FolderElement ({ folder, index, reorderFolders }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);

  const nameRef = useRef({});
  const elementRef = useRef({});

  const contextMenuContext = useContext(ContextMenuContext);
  const clipboardContext = useContext(ClipboardContext);
  const folderContext = useContext(FolderContext);

  if (!folder) { 
    folder = { 
      uuid: '', 
      name: '', 
      parentUuid: folderContext.currentFolder.uuid 
    } 
  }

  const [previousName, setPreviousName] = useState('');
  const [nameInputValue, setNameInputValue] = useState(folder.name);
  const [isNamingDelayed, setIsNamingDelayed] = useState(false);


  // HANDLERS
  const handleOnNameFocus = (event) => {
    setTimeout(() => setIsNamingDelayed(true), 10);
    setPreviousName(event.target.value);
    event.currentTarget.setSelectionRange(
      event.currentTarget.value.length,
      event.currentTarget.value.length
    )
  }

  const handleOnNameBlur = async () => {
    if (nameInputValue && (nameInputValue != previousName)) {
      if (clipboardContext.isCreatingFolder) {
        await FolderService.handleCreate(userData, driveData, { ...folder, name: nameInputValue })
        .then(() => {
          //dispatch(requestUpdate());
          reorderFolders(folder, index);
          clipboardContext.setIsCreatingFolder(false);
          setTimeout(() => setIsNamingDelayed(false), 300);
        })
        .catch(() => {
          clipboardContext.setIsCreatingFolder(false);
          setTimeout(() => setIsNamingDelayed(false), 300);
        })
      } else {
        await FolderService.handleRename(userData, driveData, { ...folder, name: nameInputValue })
        .then(() => {
          //dispatch(requestUpdate());
          reorderFolders(folder, index);
          clipboardContext.setIsRenaming(false);
          setTimeout(() => setIsNamingDelayed(false), 300);
        })
        .catch(() => {
          setNameInputValue(previousName);
          clipboardContext.setIsRenaming(false);
          setTimeout(() => setIsNamingDelayed(false), 300);
        })
      }
    } else {
      setNameInputValue(previousName);
      clipboardContext.setIsCreatingFolder(false);
      clipboardContext.setIsRenaming(false);
      setTimeout(() => setIsNamingDelayed(false), 300);
    }
  }

  const handleOnNameChange = (event) => {
    setNameInputValue(event.target.value)
  }

  const handleNameOnKeyDown = (event) => {
    if (event.code === 'Enter') { 
      event.target.blur(); 
    } else if (event.code === 'Escape') { 
      setNameInputValue(previousName);
      event.target.blur();
    }

    //event.target.style.height = nameRef.current.offsetHeight + 'px';
  }

  const handleOnMouseDown = (event) => {
    clipboardContext.handleMouseDown(event, folder);
  }

  const handleOnMouseEnter = (event) => {
    clipboardContext.setHoveredElement(folder);
  }
  
  const handleOnMouseLeave = (event) => {
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
  const getIsClicked = () => {
    if (clipboardContext.clickedElements.includes(folder)) {
      return true;
    } else {
      return false;
    }
  }

  const getIsHovered = () => {
    if (clipboardContext.hoveredElement) {
      return clipboardContext.hoveredElement.uuid === folder.uuid;
    } else {
      return false;
    }
  }

  const getIsCut = () => {
    return clipboardData.cutElementsUuids.includes(folder.uuid);
  }

  const getIsNaming = () => {
    if ((clipboardContext.isRenaming && clipboardContext.clickedElements.includes(folder)) || 
    (clipboardContext.isCreatingFolder && (!folder.uuid))) {
      return true;
    } else {
      return false;
    }
  }
  
  const getNameStyle = () => {
    let res = '';
    if (getIsNaming()) {
      res = 'bg-sky-400/20';
    } else {
      if (getIsClicked()) {
        res = 'bg-sky-400/20';
      } else {
        if (getIsHovered()) {
          res = 'bg-sky-400/10';
        }
      } 
    }
    return res;
  }

  const getIconStyle = () => {
    let res = '';
    if (getIsClicked()) {
      res = 'opacity-80'
    } else {
      if (getIsHovered()) {
        res = 'opacity-60'
      } else {
        res = 'opacity-40'
      }
    }
    return res;
  }

  
  // RENDER
  if (settingsData.type === 'grid') {
    return (
      <Box className={`w-full h-full p-2 place-self-center border-box
      transition-all duration-300
      border-solid border-0 border-black rounded-md`}
      onMouseDown={handleOnMouseDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onContextMenu={handleOnContextMenu}
      onDoubleClick={handleOnDoubleClick}
      ref={elementRef}>
  
        <Box className={`w-full
        ${getIsCut() ? 'opacity-50' : 'opacity-100'}`}>
          <Folder className={`w-full h-fit place-self-center 
          transition-all duration-300
          pointer-events-none select-none 
          ${getIconStyle()}`}/>
        </Box>
  

        <Box className='w-full mt-2 place-self-center overflow-visible'>
          <p className={`w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
          select-none pointer-events-none
          transition-all duration-300
          rounded-[0.3rem] overflow-hidden max-w-32
          leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis
          ${getNameStyle()}
          ${(isNamingDelayed && getIsNaming()) ? 'bg-transparent' : ''}
          ${getIsNaming() ? 'opacity-0' : 'opacity-100'}`}
          ref={nameRef}>
            {nameInputValue}   
          </p>

          {(getIsNaming() || isNamingDelayed) &&
            <TextareaAutosize className={`w-full h-full px-1 absolute
            transition-opacity 
            bg-transparent
            leading-6 text-center
            ${isNamingDelayed && getIsNaming() ? 'opacity-100 duration-200' : 'opacity-0 duration-300'}`}
            style={{
              top: (nameRef.current.offsetTop) + 'px',
              left: (elementRef.current.offsetLeft + 8) + 'px',
              maxWidth: (elementRef.current.offsetWidth - 16) + 'px',
              height: nameRef.current.offsetHeight + 'px'
            }}
            name='name'
            spellCheck={false}
            autoFocus
            minRows={1}
            value={nameInputValue}
            onChange={handleOnNameChange}
            onFocus={handleOnNameFocus}
            onBlur={handleOnNameBlur}
            onKeyDown={handleNameOnKeyDown} />
          }
        </Box>

      </Box>
    );
  } 
    
}
