import React, { useContext } from 'react';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import FolderElementIcon from 'pages/drive/elements/FolderElement/FolderElementIcon';


export default function FolderElement ({ 
  index, 
  folder, 
  generatedData,
  viewMode,
  handleOnElementMouseDown, 
  handleOnElementContextMenu, 
  handleOnElementDoubleClick 
}) {

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
    handleOnElementDoubleClick(event, folder);
  }

  
  // RENDER
  const commonHandlerProps = {
    onMouseDown: handleOnMouseDown,
    onMouseEnter: handleOnMouseEnter,
    onMouseLeave: handleOnMouseLeave,
    onContextMenu: handleOnContextMenu,
    onDoubleClick: handleOnDoubleClick
  }

  if (folder) {
    if (viewMode === 'grid') {
      return (
        <Box data-testid='folder-element'
        className={`
        transition-colors
        ${generatedData?.boxStyle}`}
        style={{
          width: generatedData?.boxWidth + 'px',
          padding: generatedData?.boxPadding + 'px'
        }}> 
    
          <Box data-testid='folder-icon-box'
          className={`w-full aspect-4-3`}
          { ...commonHandlerProps }>
            <FolderElementIcon />
          </Box>
    
          <Box data-testid='folder-name-box'
          className='w-full h-12 pt-2 mb-2 place-self-center overflow-visible'
          { ...commonHandlerProps }>
            <p data-testid='folder-name'
            className={`element-name
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
    } else if (viewMode === 'list') {
      return (
        <Box data-testid='folder-element'
        className={`
        w-full relative
        transition-colors
        ${generatedData?.rowStyle}`}
        style={{
          height: generatedData?.rowHeight + 'px'
        }}>
          {generatedData?.rowBackground && generatedData?.rowBackground}

          <Box data-testid='folder-row-box' 
          className='w-fit flex'
          { ...commonHandlerProps }>

            <Box className={`h-full ml-2 aspect-4-3`}
            style={{
              height: generatedData?.rowHeight + 'px',
              padding: generatedData?.rowPadding + 'px',
            }}>
              <FolderElementIcon 
              isSmall={generatedData?.rowShouldUseSmallIcon}/>
            </Box>
    
            {generatedData?.rowColumns?.map(column => 
              <p data-testid={'folder-column'}
              key={folder.uuid + '-' + column.name}
              className={`h-8 w-full py-1 px-2 my-auto 
              shrink-0
              pointer-events-none
              text-left text-ellipsis overflow-hidden break-all whitespace-nowrap`}
              style={{
                width: column.width
              }}> 
                {column.value}
              </p>
            )}

          </Box>

        </Box>
      );
    }
  }
    
}
