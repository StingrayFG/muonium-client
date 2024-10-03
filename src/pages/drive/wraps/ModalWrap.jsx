import React, { Children, useCallback, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ModalContext } from 'contexts/ModalContext.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'


export default function ModalWrap ({ children }) {
  const [modalStates, setModalStates] = useState([]);


  const [awaitingOpenModal, setAwaitingOpenModal] = useState({});
  const openModal = (newComponent, newClosesOnClick = false, newHasCloseButton = false) => {
    setAwaitingOpenModal({ isOpen: true, component: newComponent, closesOnClick: newClosesOnClick, hasCloseButton: newHasCloseButton })
  }
  useEffect(() => {
    if (Object.keys(awaitingOpenModal).length > 0) {
      setModalStates([awaitingOpenModal]);
      setAwaitingOpenModal({});
    }
  }, [awaitingOpenModal])


  const [awaitingOpenNextModal, setAwaitingOpenNextModal] = useState({});
  const openNextModal = (newComponent, newClosesOnClick = false, newHasCloseButton = false) => {
    setAwaitingOpenNextModal({ isOpen: true, component: newComponent, closesOnClick: newClosesOnClick, hasCloseButton: newHasCloseButton });
  }
  useEffect(() => {
    if (Object.keys(awaitingOpenNextModal).length > 0) {
      if (modalStates.length > 0) {
        setModalStates([...modalStates, { ...awaitingOpenNextModal, isOpen: false }])
        setTimeout(() => {
          setModalStates([...modalStates, { ...modalStates[modalStates.length - 1], isOpen: true }]);
        }, 300);
      } else {
        setModalStates([awaitingOpenNextModal]);  
      } 
      setAwaitingOpenNextModal({});
    }
  }, [awaitingOpenNextModal])


  const [isAwaitingCloseModal, setIsAwaitingCloseModal] = useState(false);
  const closeModal = () => {
    setIsAwaitingCloseModal(true);
  }
  useEffect(() => {
    if (isAwaitingCloseModal) {
      if (modalStates.length > 1) {
        setModalStates([{ ...modalStates[0], isOpen: false}, ...modalStates.slice(1)]);
        setTimeout(() => {
          setModalStates([])
        }, 500);
      } else {
        setModalStates([{ ...modalStates[0], isOpen: false }])
        setTimeout(() => {
          setModalStates([])
        }, 500);
      } 
      setIsAwaitingCloseModal(false);
    }
  }, [isAwaitingCloseModal])

  
  const [isAwaitingCloseNextModal, setIsAwaitingCloseNextModal] = useState(false);
  const closeNextModal = () => {
    setIsAwaitingCloseNextModal(true);
  }
  useEffect(() => {
    if (isAwaitingCloseNextModal === true) {
      if (modalStates.length > 1) {
        setModalStates([...modalStates.slice(0, -1), { ...modalStates[modalStates.length - 1], isOpen: false }]);
        setTimeout(() => {
          setModalStates(modalStates.slice(0, -1))     
        }, 300);
      } else {
        setModalStates([{...modalStates[0], isOpen: false}])
        setTimeout(() => {
          setModalStates([])
        }, 500);
      } 
      setIsAwaitingCloseNextModal(false);
    }
  }, [isAwaitingCloseNextModal])


  const closeOnButton = () => {
    if (getTopModal().hasCloseButton) {
      closeNextModal();
    }
  }

  const closeOnClick = (event) => {
    if ((getTopModal().closesOnClick) && (event.currentTarget === event.target)) {
      closeNextModal();
    }
  }

  const getTopModal = () => {
    if (modalStates.length > 0) {
      return modalStates[modalStates.length - 1];
    } else {
      return {};
    }
  }

  const getBottomModal = () => {
    if (modalStates.length > 0) {
      return modalStates[0];
    } else {
      return {};
    }
  }

  return (
    <ModalContext.Provider value={{ openModal, openNextModal, closeModal, closeNextModal }}>

      <Box className={`z-20 w-full h-dvh grid overflow-hidden fixed
      transition-opacity duration-500
      bg-black/80
      ${getBottomModal().isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={closeOnClick}>
        {(modalStates.length > 0) && <>
          {modalStates.map((modal, index) => (
            <Box className={`w-full max-h-full place-self-center grid absolute
            transition-all duration-500
            ${((index === modalStates.length - 1) && modal.isOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            key={'modal-' + index}
            onClick={closeOnClick}>
              {modal.component && modal.component}
            </Box>)
          )}
        </>}

        {getTopModal().hasCloseButton && 
          <button className='h-12 w-12 absolute top-0 right-0 grid place-content-center
          hover:opacity-50'
          onClick={closeOnButton}>
            <XLg className='w-5 h-5'/>
          </button>
        }
      </Box>

      { children }

    </ModalContext.Provider>
  )
};
  