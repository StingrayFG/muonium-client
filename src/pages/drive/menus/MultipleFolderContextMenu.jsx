import { useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function MultipleFolderContextMenu () {
  const clipboardContext = useContext(ClipboardContext);

  
  const options = [
    { text: 'Cut', icon: 'cut', handleOnClick: clipboardContext.cutClickedElements },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: clipboardContext.removeClickedElements },
  ]


  return (
    <CommonContextMenu options={options} />  
  ); 
};
