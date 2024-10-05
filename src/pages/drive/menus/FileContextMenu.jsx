import { useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function FileContextMenu () {
  const clipboardContext = useContext(ClipboardContext)

  const options = [
    { text: 'Download', icon: 'download', handleOnClick: clipboardContext.downloadClickedElements },
    'line',
    { text: 'Copy', icon: 'copy', handleOnClick: clipboardContext.copyClickedElements },
    { text: 'Cut', icon: 'cut', handleOnClick: clipboardContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => clipboardContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: clipboardContext.removeClickedElements },
  ] 


  return (
    <CommonContextMenu options={options} />  
  ); 
};



