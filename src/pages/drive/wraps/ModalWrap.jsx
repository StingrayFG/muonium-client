import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ModalContext } from 'contexts/ModalContext.jsx';

import { ReactComponent as XLg } from 'assets/icons/x-lg.svg'


export default function ModalWrap ({ children }) {

  const [modalStates, setModalStates] = useState([]);

    
  // OPENING
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
      setModalStates([{...awaitingOpenModal, isOpen: false}]);
      setTimeout(() => setModalStates([{...awaitingOpenModal, isOpen: true}], 50));
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
          setModalStates([...modalStates, { ...awaitingOpenNextModal, isOpen: true }]);
        }, 300);
      } else {
        setModalStates([awaitingOpenNextModal]);  
      } 
      setAwaitingOpenNextModal({});
    }
  }, [awaitingOpenNextModal])


  // CLOSING
  const [isAwaitingCloseAllModals, setIsAwaitingCloseAllModals] = useState(false);
  const closeAllModals = () => {
    setIsAwaitingCloseAllModals(false);
    setIsAwaitingCloseAllModals(true);
  }
  useEffect(() => {
    if (isAwaitingCloseAllModals) {
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
      setIsAwaitingCloseAllModals(false);
    }
  }, [isAwaitingCloseAllModals])


  const [isChangingModals, setIsChangingModals] = useState(false);
  const [closedModalsCount, setClosedModalsCount] = useState(false);
  const [isAwaitingCloseMultipleModals, setIsAwaitingCloseMultipleModals] = useState(false);

  const closeMultipleModals = (count = 1) => {
    if (!isChangingModals) {
      setIsChangingModals(true);
      setClosedModalsCount(count)
      setIsAwaitingCloseMultipleModals(false);
      setIsAwaitingCloseMultipleModals(true);
    }
  }
  useEffect(() => {
    if (isAwaitingCloseMultipleModals) {
      if (modalStates.length > 1) {
        setModalStates([...modalStates.slice(0, -1), { ...modalStates[modalStates.length - 1], isOpen: false }]);
        setTimeout(() => {
          setModalStates([...modalStates.slice(0, Math.max(-modalStates.length, -closedModalsCount))])     
        }, 300);
      } else {
        setModalStates([{...modalStates[0], isOpen: false}])
        setTimeout(() => {
          setModalStates([])
        }, 300);
      } 
      setIsChangingModals(false);
      setIsAwaitingCloseMultipleModals(false);
    }
  }, [isAwaitingCloseMultipleModals])


  const [isAwaitingCloseNextModal, setIsAwaitingCloseNextModal] = useState(false);
  const closeNextModal = () => {
    if (!isChangingModals) {
      setIsChangingModals(true);
      setIsAwaitingCloseNextModal(false);
      setIsAwaitingCloseNextModal(true);
    }
  }
  useEffect(() => {
    if (isAwaitingCloseNextModal) {
      if (modalStates.length > 1) {
        setModalStates([...modalStates.slice(0, -1), { ...modalStates[modalStates.length - 1], isOpen: false }]);
        setTimeout(() => {
          setModalStates([...modalStates.slice(0, -1)])     
        }, 300);
      } else {
        setModalStates([{...modalStates[0], isOpen: false}])
        setTimeout(() => {
          setModalStates([])
        }, 300);
      } 
      setIsChangingModals(false);
      setIsAwaitingCloseNextModal(false);
    }
  }, [isAwaitingCloseNextModal])


  // OTHER
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
      openModal, openNextModal, closeAllModals, closeNextModal, closeMultipleModals,
      modalStates,
      getBottomModal, getTopModal, getIsVisible, 
      closeOnClickOutside, closeOnButton
    }}>

      { children }

    </ModalContext.Provider>
  )
};
  