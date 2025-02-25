import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import FileElementIcon from 'pages/drive/elements/FileElementIcon';

import config from 'config.json';


export default function FileElement ({ index, file, generatedData, 
  handleOnElementMouseDown, handleOnElementContextMenu, handleOnElementDoubleClick }) {
  const settingsData = useSelector(state => state.settings);

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
    handleOnElementDoubleClick(event, file, index);
  }

  
  // RENDER
  if (file) {
    if (settingsData.viewMode === 'grid') {
      return (
        <Box data-testid='file-element' 
        className={`
        transition-colors
        ${generatedData?.boxStyle}`}
        style={{
          width: (generatedData?.gridSize * 0.8) + 'px',
          margin: (generatedData?.gridSize * 0.1) + 'px'
        }}> 
      
          <Box id='file-icon-box'
          className={`w-full aspect-4-3 grid`}
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
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
              <Box data-testid='file-icon'
              className={`element-icon h-full place-self-center 
              transition-opacity
              pointer-events-none select-none`}>
                <FileElementIcon file={file}/>
              </Box>
            }
          </Box>
    
          <Box id='file-name-box'
          className='w-full h-12 pt-2 mb-2 place-self-center overflow-visible'
          onMouseDown={handleOnMouseDown}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onContextMenu={handleOnContextMenu}
          onDoubleClick={handleOnDoubleClick}>
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
    } else if (settingsData.viewMode === 'list') {
      return (
        <Box data-testid='file-element' 
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
              height: generatedData?.listSize + 'px',
              padding: generatedData?.listSize * 0.1 + 'px',
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
                <Box data-testid='file-icon' 
                className={`
                pointer-events-none
                h-full place-self-center 
                transition-opacity
                pointer-events-none select-none 
                ${(settingsData.listElementHeight >= config.elements.listSmallIconsHeight) ?
                'element-icon' : 'element-small-icon'}`}>
                  <FileElementIcon 
                  type={generatedData?.type}
                  isSmall={!(settingsData.listElementHeight >= config.elements.listSmallIconsHeight)}/>
                </Box>
              }
            </Box>

            {generatedData?.rowColumns}

          </Box>

        </Box>
      );
    }
  }
    
}
