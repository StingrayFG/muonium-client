import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { DropzoneContext } from 'contexts/DropzoneContext';
import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function DefaultContextMenu () {
  const dropzoneContext = useContext(DropzoneContext);
  const contextMenuContext = useContext(ContextMenuContext)

  const clipboardData = useSelector(state => state.clipboard);

  const options = clipboardData.elements.length > 0 ? 
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: dropzoneContext.open },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) },
    'line',
    { text: 'Paste', icon: 'paste', handleOnClick: contextMenuContext.pasteClickedElements }
  ] 
  :
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: dropzoneContext.open },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) }
  ]

  return (
    <CommonContextMenu options={options} />  
  );
};
