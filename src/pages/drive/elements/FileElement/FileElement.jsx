import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext';

import ImageModal from 'pages/drive/modals/ImageModal';

import FileElementIcon from 'pages/drive/elements/FileElementIcon';

import config from 'config.json';


export default function FileElement ({ index, file, listViewColumns, isClicked, isCut }) {
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);


  // IMAGE
  const imageSrc = file.thumbnail ? 'data:image/png;base64,' + file.thumbnail : file.imageBlob


  // HANDLERS
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
  const getBoxStyle = () => {
    let res = '';
    if (isCut) {
      res = 'element-box-cut';
    } else {
      if (isClicked) {
        res = 'element-box-clicked';
      } else {
        res = 'element-box';
      }
    }  
    return res;
  }

  const getRowStyle = () => { 
    let res = '';
    if (isCut) {
      res = 'element-row-cut';
    } else {
      if (isClicked) {
        res = 'element-row-clicked';
      } else {
        res = 'element-row';
      }
    }  
    return res;
  }


  // RENDER
  if (file) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box data-testid='file-element' 
        className={`h-full
        transition-all
        ${getBoxStyle()}`}
        style={{
          width: (settingsData.gridElementWidth * 0.8) + 'px',
          margin: (settingsData.gridElementWidth * 0.1) + 'px'
        }}> 
      
          <Box className={`w-full aspect-4-3 grid`}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            {(file.thumbnail || file.imageBlob) ? 
              <img data-testid='file-icon'
              className={`element-image
              w-full h-full object-contain 
              transition-opacity`}
              src={imageSrc} 
              alt=''
              draggable={false} />
              :
              <Box data-testid='file-icon'
              className={`element-icon h-full place-self-center 
              transition-opacity
              pointer-events-none select-none`}>
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
            <p data-testid='file-name'
            className={`element-name
            w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded-[0.3rem] overflow-hidden max-w-32
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis`}>
              {file.name}
            </p>
          </Box>

        </Box>
      );
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box data-testid='file-element' 
        className={`w-full relative
        transition-all
        ${getRowStyle()}`}
        style={{
          height: settingsData.listElementHeight + 'px'
        }}>
          {((index % 2) === 1) &&
            <Box className='w-full h-full absolute z-[-10] bg-neutral-950/40' />
          }

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
              {(file.thumbnail || file.imageBlob) ? 
                <img data-testid='file-icon' 
                className={`element-image
                w-full h-full object-contain`}
                src={imageSrc} 
                alt=''
                draggable={false} />
                :
                <Box data-testid='file-icon' 
                className={`
                h-full place-self-center 
                transition-opacity
                pointer-events-none select-none 
                ${(settingsData.listElementHeight >= config.elements.listSmallIconsHeight) ?
                'element-icon' : 'element-small-icon'}`}>
                  <FileElementIcon 
                  file={file} 
                  shallBeSmall={!(settingsData.listElementHeight >= config.elements.listSmallIconsHeight)}/>
                </Box>
              }
            </Box>

            {listViewColumns}

          </Box>

        </Box>
      );
    }
  }
    
}
