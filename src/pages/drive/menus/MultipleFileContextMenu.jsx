import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu/CommonContextMenu';


export default function MultipleFileContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Download', icon: 'download', handleOnClick: contextMenuContext.downloadSelectedElements },
    'line',
    { text: 'Copy', icon: 'copy', handleOnClick: contextMenuContext.copySelectedElements },
    { text: 'Cut', icon: 'cut', handleOnClick: contextMenuContext.cutSelectedElements },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: contextMenuContext.removeSelectedElements },
  ] 


  return (
    <CommonContextMenu options={options} />  
  ); 
};



