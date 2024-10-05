import { useContext } from 'react';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function BookmarkContextMenu () {
  const clipboardContext = useContext(ClipboardContext)

  const options = [
    { text: 'Remove from places', icon: 'remove-bookmark', handleOnClick: clipboardContext.deleteClickedElements },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
