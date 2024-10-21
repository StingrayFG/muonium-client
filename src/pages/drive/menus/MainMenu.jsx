import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';
import { ModalContext } from 'contexts/ModalContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';
import SettingsModal from 'pages/drive/modals/SettingsModal';


export default function MainMenu ({ }) {
  const clipboardData = useSelector(state => state.clipboard);

  const contextMenuContext = useContext(ContextMenuContext);
  const modalContext = useContext(ModalContext);

  const openSettingsModal = () => {
    modalContext.openModal(<SettingsModal />)
    contextMenuContext.setIsContextMenuOpen(false)
    contextMenuContext.setIsContextMenuLockActive(false)
  }

  const options = clipboardData.elements.length > 0 ? 
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: contextMenuContext.openUpload },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) },
    'line',
    { text: 'Paste', icon: 'paste', handleOnClick: contextMenuContext.pasteClickedElements },
    'line',
    { text: 'Settings', icon: 'settings', handleOnClick: openSettingsModal }
  ] 
  :
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: contextMenuContext.openUpload  },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) },
    'line',
    { text: 'Settings', icon: 'settings',  handleOnClick: openSettingsModal }
  ]

  return (
    <CommonContextMenu options={options} />  
  );
};
