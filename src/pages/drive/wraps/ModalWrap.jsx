import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ModalContext } from 'contexts/ModalContext.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'


export default function ModalWrap ({ children }) {
  const [modalStates, setModalStates] = useState([]);


  const [awaitingOpenModal, setAwaitingOpenModal] = useState({});
  const openModal = (component, options={}) => {
    if (modalStates.length === 0) {
      setAwaitingOpenModal({ 
        isOpen: true, 
        component, 
        doesCloseOnClickOutside: options.doesCloseOnClickOutside ? options.doesCloseOnClickOutside : false, 
        hasCloseButton: options.hasCloseButton ? options.hasCloseButton : false });
    }
  }
  useEffect(() => {
    if (Object.keys(awaitingOpenModal).length > 0) {
      setModalStates([awaitingOpenModal]);
      setAwaitingOpenModal({});
    }
  }, [awaitingOpenModal])


  const [awaitingOpenNextModal, setAwaitingOpenNextModal] = useState({});
  const openNextModal = (component, options={}) => {
    setAwaitingOpenNextModal({ 
      isOpen: true, 
      component, 
      doesCloseOnClickOutside: options.doesCloseOnClickOutside ? options.doesCloseOnClickOutside : false, 
      hasCloseButton: options.hasCloseButton ? options.hasCloseButton : false });
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
        }, 300);
      } else {
        setModalStates([{ ...modalStates[0], isOpen: false }])
        setTimeout(() => {
          setModalStates([])
        }, 300);
      } 
      setIsAwaitingCloseModal(false);
    }
  }, [isAwaitingCloseModal])

  
  const [isAwaitingCloseNextModal, setIsAwaitingCloseNextModal] = useState(false);
  const closeNextModal = () => {
    setIsAwaitingCloseNextModal(true);
  }
  useEffect(() => {
    if (isAwaitingCloseNextModal) {
      if (modalStates.length > 1) {
        setModalStates([...modalStates.slice(0, -1), { ...modalStates[modalStates.length - 1], isOpen: false }]);
        setTimeout(() => {
          setModalStates(modalStates.slice(0, -1))     
        }, 300);
      } else {
        setModalStates([{...modalStates[0], isOpen: false}])
        setTimeout(() => {
          setModalStates([])
        }, 300);
      } 
      setIsAwaitingCloseNextModal(false);
    }
  }, [isAwaitingCloseNextModal])


  const closeOnButton = () => {
    if (getTopModal().hasCloseButton) {
      closeNextModal();
    }
  }

  const closeOnClickOutside = (event) => {
    if ((getTopModal().doesCloseOnClickOutside) && (event.currentTarget === event.target)) {
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

  const getIsVisible = (modal, index) => {
    return ((index === modalStates.length - 1) && modal.isOpen) || (modalStates.length === 1);
  }

  
  return (
    <ModalContext.Provider value={{ 
      openModal, openNextModal, closeModal, closeNextModal, 
      modalStates,
      getBottomModal, getTopModal, getIsVisible, 
      closeOnClickOutside, closeOnButton
    }}>

      { children }

    </ModalContext.Provider>
  )
};
  