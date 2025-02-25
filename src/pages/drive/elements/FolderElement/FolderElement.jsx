import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/pathSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as FolderMu } from 'assets/icons/elements/muonium/folder.svg'
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg'

import config from 'config.json';


export default function FolderElement ({ index, folder, generatedData,
  handleOnElementMouseDown, handleOnElementContextMenu, handleOnElementDoubleClick }) {

  const dispatch = useDispatch();

  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);


  // HANDLERS
  const handleOnMouseEnter = () => {
    contextMenuContext.setHoveredElement(folder);
  }
  
  const handleOnMouseLeave = () => {
    contextMenuContext.clearHoveredElement();
  }

  const handleOnMouseDown = (event) => {
    handleOnElementMouseDown(event, folder, index);
  }

  const handleOnContextMenu = (event) => {
    handleOnElementContextMenu(event, folder);
  }

  const handleOnDoubleClick = (event) => {
    handleOnElementDoubleClick(event, folder, index);
  }

  
  // RENDER
  if (folder) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box data-testid='folder-element'
        className={`
        transition-colors
        ${generatedData?.boxStyle}`}
        style={{
          width: (generatedData?.gridSize * 0.8) + 'px',
          margin: (generatedData?.gridSize * 0.1) + 'px'
        }}> 
    
          <Box id='folder-icon-box'
          className={`w-full aspect-4-3 grid`}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <FolderMu
            data-testid='folder-icon'
            className={`element-icon
            w-full h-full place-self-center 
            transition-opacity
            pointer-events-none select-none`}/>
          </Box>
    
          <Box id='folder-name-box'
          className='w-full h-12 pt-2 mb-2 place-self-center overflow-visible'
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <p data-testid='folder-name'
            className={`element-name bg-blue-600
            w-fit max-w-full h-fit max-h-12
            mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded overflow-hidden
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis`}>
              {folder.name}   
            </p>
          </Box>

        </Box>
      );
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box data-testid='folder-element'
        className={`
        w-full relative
        transition-colors
        ${generatedData?.rowStyle}`}
        style={{
          height: generatedData?.listSize + 'px'
        }}>
          {generatedData?.rowBackground && generatedData?.rowBackground}

          <Box id='folder-row-box' 
          className='w-fit flex'
          style={{
            marginLeft: generatedData?.listSize + 'px'
          }}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>

            <Box className={`h-full ml-2 aspect-4-3 grid`}
            style={{
              height: generatedData?.listSize+ 'px',
              padding: generatedData?.listSize * 0.1 + 'px',
            }}>
            {(settingsData.listElementHeight >= config.elements.listSmallIconsHeight) ?
              <FolderMu data-testid='folder-icon'
              className={`element-icon
              w-full h-full
              transition-opacity
              pointer-events-none select-none`}/>
              :
              <FolderBs data-testid='folder-icon'
              className={`element-icon-small
              w-full h-full
              transition-opacity
              pointer-events-none select-none`}/>
            }
            </Box>
    
            {generatedData?.rowColumns}

          </Box>

        </Box>
      );
    }
  }
    
}
