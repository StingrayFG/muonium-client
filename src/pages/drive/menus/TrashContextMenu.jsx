import { useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function TrashContextMenu () {
  const clipboardContext = useContext(ClipboardContext)

  const options = [
    { text: 'Recover', icon: 'recover', handleOnClick: clipboardContext.recoverClickedElements },
    { text: 'Delete', icon: 'trash', handleOnClick: clipboardContext.deleteClickedElements },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
