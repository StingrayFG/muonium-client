import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function TrashContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Recover', icon: 'recover', handleOnClick: contextMenuContext.recoverClickedElements },
    { text: 'Delete', icon: 'trash', handleOnClick: contextMenuContext.deleteClickedElements },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
