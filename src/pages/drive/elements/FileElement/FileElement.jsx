import React, { useContext } from 'react';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import FileElementIcon from 'pages/drive/elements/FileElement/FileElementIcon';


export default function FileElement ({ 
  index, 
  file, 
  generatedData, 
  viewMode,
  handleOnElementMouseDown, 
  handleOnElementContextMenu,
  handleOnElementDoubleClick 
}) {

  const contextMenuContext = useContext(ContextMenuContext);

  // HANDLERS
  const handleOnMouseEnter = () => {
    contextMenuContext.setHoveredElement(file);
  }
  
  const handleOnMouseLeave = () => {
    contextMenuContext.clearHoveredElement();
  }

  const handleOnMouseDown = (event) => {
    handleOnElementMouseDown(event, file, index);
  }
  
  const handleOnContextMenu = (event) => {
    handleOnElementContextMenu(event, file);
  }

  const handleOnDoubleClick = (event) => {
    handleOnElementDoubleClick(event, file);
  }

  // RENDER
  const commonHandlerProps = {
    onMouseDown: handleOnMouseDown,
    onMouseEnter: handleOnMouseEnter,
    onMouseLeave: handleOnMouseLeave,
    onContextMenu: handleOnContextMenu,
    onDoubleClick: handleOnDoubleClick
  }

  if (file) {
    if (viewMode === 'grid') {
      return (
        <Box data-testid='file-element' 
        className={`
        transition-colors
        ${generatedData?.boxStyle}`}
        style={{
          width: generatedData?.boxWidth + 'px',
          padding: generatedData?.boxPadding + 'px'
        }}> 
      
          <Box data-testid='file-icon-box'
          className={`w-full aspect-4-3`}
          { ...commonHandlerProps }>
            {generatedData?.thumbnailLink ? 
              <img data-testid='file-thumbnail'
              className={`element-image
              pointer-events-none
              w-full h-full object-contain 
              transition-opacity`}
              src={generatedData?.thumbnailLink} 
              alt=''
              draggable={false} />
              :
              <FileElementIcon file={file}/>
            }
          </Box>
    
          <Box data-testid='file-name-box'
          className='w-full h-12 pt-2 mb-2 place-self-center overflow-visible'
          { ...commonHandlerProps }>
            <p data-testid='file-name'
            className={`element-name
            pointer-events-none
            w-fit max-w-full h-fit max-h-12
            mx-auto px-1 place-self-center 
            select-none pointer-events-none
            transition-all
            rounded overflow-hidden
            leading-6 text-center break-words whitespace-pre-wrap second-line-ellipsis`}>
              {file.name}
            </p>
          </Box>

        </Box>
      );
    } else if (viewMode === 'list') {
      return (
        <Box data-testid='file-element' 
        className={`
        w-full relative
        transition-colors
        ${generatedData?.rowStyle}`}
        style={{
          height: generatedData?.rowHeight + 'px'
        }}>
          {generatedData?.rowBackground && generatedData?.rowBackground}

          <Box data-testid='file-row-box'
          className='w-fit flex'
          { ...commonHandlerProps }>

            <Box className={`h-full ml-2 aspect-4-3`}
            style={{
              height: generatedData?.rowHeight + 'px',
              padding: generatedData?.rowPadding + 'px',
            }}>
              {generatedData?.thumbnailLink ? 
                <img 
                data-testid='file-thumbnail' 
                className={`element-image
                pointer-events-none
                w-full h-full object-contain`}
                src={generatedData?.thumbnailLink} 
                alt=''
                draggable={false} />
                :
                <FileElementIcon 
                type={generatedData?.type}
                isSmall={generatedData?.rowShouldUseSmallIcon}/>
              }
            </Box>

            {generatedData?.rowColumns?.map(column => 
              <p data-testid={'file-column'}
              key={file.uuid + '-' + column.name}
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
