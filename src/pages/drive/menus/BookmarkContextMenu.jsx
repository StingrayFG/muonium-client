import { useContext } from 'react';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function BookmarkContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Remove from places', icon: 'remove-bookmark', handleOnClick: contextMenuContext.deleteClickedElements },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
