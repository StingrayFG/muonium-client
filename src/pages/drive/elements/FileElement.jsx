import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { renameElements } from 'state/slices/CurrentFolderSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import RenameModal from 'pages/drive/modals/RenameModal';
import ImageModal from 'pages/drive//modals/ImageModal';
import FileElementIcon from 'pages/drive/elements/FileElementIcon';


export default function FileElement ({ file }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const clipboardData = useSelector(state => state.clipboard);
  const settingsData = useSelector(state => state.settings);
  const currentFolderData = useSelector(state => state.currentFolder);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);


  // IMAGE
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (file.thumbnail) {
      setImageSrc('data:image/png;base64,' + file.thumbnail);
    } else {
      setImageSrc(file.imageBlob);
    }
  }, [file])


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
    } 
  }

  const handleOnMouseDown = (event) => {
    contextMenuContext.handleOnElementMouseDown(event, file);
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

  
  // RENDER
  if (file) {
    if (settingsData.type === 'grid') {
      return (
        <Box className={`w-full h-full p-4 place-self-center border-box
        transition-all duration-300`}>
    
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
              <Box className={`w-full h-full place-self-center 
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
    } 
  }
    
}
