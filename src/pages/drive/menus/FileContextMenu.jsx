import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function FileContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Download', icon: 'download', handleOnClick: contextMenuContext.downloadClickedElements },
    'line',
    { text: 'Copy', icon: 'copy', handleOnClick: contextMenuContext.copyClickedElements },
    { text: 'Cut', icon: 'cut', handleOnClick: contextMenuContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => contextMenuContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: contextMenuContext.removeClickedElements },
  ] 


  return (
    <CommonContextMenu options={options} />  
  ); 
};



