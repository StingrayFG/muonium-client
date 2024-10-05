import { useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function MultipleFileContextMenu () {
  const clipboardContext = useContext(ClipboardContext)

  const options = [
    { text: 'Download', icon: 'download', handleOnClick: clipboardContext.downloadClickedElements },
    'line',
    { text: 'Copy', icon: 'copy', handleOnClick: clipboardContext.copyClickedElements },
    { text: 'Cut', icon: 'cut', handleOnClick: clipboardContext.cutClickedElements },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: clipboardContext.removeClickedElements },
  ] 


  return (
    <CommonContextMenu options={options} />  
  ); 
};



