import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { createBookmark, deleteBookmark } from 'state/slices/BookmarkSlice';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';



export default function FolderContextMenu ({ point, folder }) {
  const contextMenuContext = useContext(ContextMenuContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);


  const options = bookmarkData.bookmarkedFoldersUuids.includes(folder?.uuid) ?  
  [ 
    { text: 'Remove from places', icon: 'remove-bookmark', handleOnClick: () => {
      dispatch(deleteBookmark({ userData, folderData: folder }));
      contextMenuContext.setIsContextMenu(false);
    }},
    'line',
    { text: 'Cut', icon: 'cut', handleOnClick: contextMenuContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => contextMenuContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: contextMenuContext.removeClickedElements },
  ] 
  : 
  [
    { text: 'Add to places', icon: 'add-bookmark', handleOnClick: () => {
      dispatch(createBookmark({ userData, folderData: folder }));
      contextMenuContext.setIsContextMenu(false);
    }},
    'line',
    { text: 'Cut', icon: 'cut', handleOnClick: contextMenuContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => contextMenuContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: contextMenuContext.removeClickedElements },
  ]


  return (
    <CommonContextMenu options={options} point={point}/>  
  );
};
