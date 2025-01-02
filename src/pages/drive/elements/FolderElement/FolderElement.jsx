import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/pathSlice';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as FolderMu } from 'assets/icons/elements/muonium/folder.svg'
import { ReactComponent as FolderBs } from 'assets/icons/elements/bootstrap/folder2.svg'

import config from 'config.json';


export default function FolderElement ({ index, folder, listViewColumns, isClicked, isCut }) {
  const dispatch = useDispatch();

  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext);


  // HANDLERS
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
  if (folder) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box data-testid='folder-element'
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
            <FolderMu data-testid='folder-icon'
            className={`element-icon
            w-full h-full place-self-center 
            transition-opacity
            pointer-events-none select-none`}/>
          </Box>
    
          <Box className='w-full pt-2 place-self-center overflow-visible'
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
            <p data-testid='folder-name'
            className={`element-name
            w-fit max-w-full h-full min-h-6 mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded-[0.3rem] overflow-hidden max-w-32
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis`}>
              {folder.name}   
            </p>
          </Box>

        </Box>
      );
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box data-testid='folder-element'
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
    
            {listViewColumns}

          </Box>

        </Box>
      );
    }
  }
    
}
