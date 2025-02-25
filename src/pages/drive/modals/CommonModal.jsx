import { useContext, useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSwipeable } from 'react-swipeable';

import { ModalContext } from 'contexts/ModalContext';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg'


export default function CommonModal ({ header, contents, customCloseFunction }) {
  const modalContext = useContext(ModalContext);

  const modalRef = useRef(null);

  useEffect(() => {
    modalRef?.current?.focus();
  }, []);

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') { 
      handleClose();
    }
  }
  
  const handleClose = () => {
    if (customCloseFunction) {
      customCloseFunction()
    } else {
      modalContext.closeNextModal();
    }
  }

  const handlers = useSwipeable({
    onSwipedRight: () => modalContext.closeNextModal(),
    preventScrollOnSwipe: true,
    //trackMouse: true
  });
  

  return (
    <Box className='h-dvh modal-body
    md:h-full md:max-h-[calc(100vh-32px)] 
    relative flex flex-col overflow-hidden select-none'
    ref={modalRef}
    tabIndex={0}
    { ...handlers }
    onKeyDown={handleOnKeyDown}>

      <Box className='hidden md:block noise-bg opacity-40 shrink-0'/>

      <Box className='h-fit mb-2
      relative shrink-0 
      grid grid-cols-[max-content_1fr_max-content]'>
        <Box className='absolute top-0 left-0
        cursor-pointer
        md:w-0 md:-ml-6 md:overflow-hidden md:pointer-events-none'
        onClick={handleClose}>
          <ArrowLeft className='h-5 w-5'/>
        </Box>
                  
        <p className='ml-8 md:ml-0 -mt-1
        text-xl font-bold'>
          {header}
        </p>

        <Box className='absolute top-0 right-0
        cursor-pointer'
        onClick={handleClose}>
          <XLg className='h-4 w-4 mt-0.5'/>
        </Box>
      </Box>

      { contents }

    </Box>
  )
};
  