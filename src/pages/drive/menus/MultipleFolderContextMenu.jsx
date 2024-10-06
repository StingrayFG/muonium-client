import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function MultipleFolderContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext);

  
  const options = [
    { text: 'Cut', icon: 'cut', handleOnClick: contextMenuContext.cutClickedElements },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: contextMenuContext.removeClickedElements },
  ]


  return (
    <CommonContextMenu options={options} />  
  ); 
};
