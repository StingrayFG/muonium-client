import React, { useContext } from 'react';
import { Box } from '@mui/material';

import { ModalContext } from 'contexts/ModalContext.jsx';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'

export default function OverlayWrap ({ children }) {

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);

  
  return (
    <>
    
      {/* Modals */}
      <Box className={`z-30 w-full h-dvh grid place-items-center overflow-hidden fixed
      transition-opacity duration-300
      bg-neutral-950/90
      ${modalContext.getBottomModal().isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={modalContext.closeOnClickOutside}>
        {(modalContext.modalStates.length > 0) && <>
          {modalContext.modalStates.map((modal, index) => (
            <Box className={`absolute grid
            transition-all duration-300
            ${modalContext.getIsVisible(modal, index) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            key={'modal-' + index}>
              {modal.component && modal.component}
            </Box>)
          )}
        </>}
      </Box>

      {/* Context menu & dragged element placeholder */}
      {contextMenuContext.isDraggingElement && 
        <Box className='bg-sky-400/20 rounded
        hidden md:block absolute' 
        style={{ 
          top: contextMenuContext.containerPoint.y, 
          left: contextMenuContext.containerPoint.x, 
          width: contextMenuContext.draggedElementSize.y, 
          height: contextMenuContext.draggedElementSize.x 
        }}>
        </Box>
      }

      <Box className={`w-screen h-dvh fixed z-40
      overflow-hidden
      ${contextMenuContext.isContextMenuLockActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={contextMenuContext.handleContextMenuLockClick}
      onContextMenu={contextMenuContext.handleContextMenuLockClick}>
        { contextMenuContext.getMenu() }
      </Box>

      {/* Children */}
      { children }

    </>
  )
};
  