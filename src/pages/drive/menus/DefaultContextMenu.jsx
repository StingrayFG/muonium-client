import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function DefaultContextMenu () {
  const contextMenuContext = useContext(ContextMenuContext)

  const clipboardData = useSelector(state => state.clipboard);

  const options = clipboardData.elements.length > 0 ? 
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: contextMenuContext.openUpload },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) },
    'line',
    { text: 'Paste', icon: 'paste', handleOnClick: contextMenuContext.pasteClickedElements },
    'line',
    { text: 'Sort by', icon: '',  },
    { text: 'View mode', icon: '',  }
  ] 
  :
  [
    { text: 'Upload a file', icon: 'upload', handleOnClick: contextMenuContext.openUpload  },
    { text: 'New folder', icon: 'new-folder', handleOnClick: () => contextMenuContext.setIsCreatingFolder(true) },
    'line',
    { text: 'Sort by', icon: '',  },
    { text: 'View mode', icon: '',  }
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
