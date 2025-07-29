import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu/CommonContextMenu';


export default function TrashContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Recover', icon: 'recover', handleOnClick: contextMenuContext.recoverSelectedElements },
    { text: 'Delete', icon: 'trash', handleOnClick: contextMenuContext.deleteSelectedElements },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
