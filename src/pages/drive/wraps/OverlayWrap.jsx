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
    
      {/* MODAL */}
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

        {modalContext.getTopModal().hasCloseButton && 
          <button className='h-12 w-12 absolute top-0 right-0 grid place-content-center
          hover:opacity-50 hover:bg-transparent bg-transparent'
          onClick={modalContext.closeOnButton}>
            <Box className='h-8 w-8 m-2 grid
            rounded-full bg-black/40'>
              <XLg className='w-5 h-5 place-self-center'/>
            </Box>      
          </button>
        }
      </Box>

      {/* MENU */}
      {contextMenuContext.isDraggingElement && 
        <Box className='bg-sky-400/20 rounded-[0.3rem]' 
        style={{ 
          position: 'absolute', 
          top: contextMenuContext.containerPoint.y, 
          left: contextMenuContext.containerPoint.x, 
          width: contextMenuContext.draggedElementSize.y, 
          height: contextMenuContext.draggedElementSize.x 
        }}>
        </Box>
      }

      <Box className={`w-full h-full absolute z-40 
      ${contextMenuContext.isContextMenuLockActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={contextMenuContext.handleContextMenuLockClick}
      onContextMenu={contextMenuContext.handleContextMenuLockClick}>
        { contextMenuContext.getMenu() }
      </Box>

      {/* CHILDREN */}
      { children }

    </>
  )
};
  