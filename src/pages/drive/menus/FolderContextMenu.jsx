import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ClipboardContext } from 'contexts/ClipboardContext.jsx';

import { createBookmark, deleteBookmark } from 'state/slices/BookmarkSlice';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';



export default function FolderContextMenu ({ point, folder }) {
  const clipboardContext = useContext(ClipboardContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);


  const options = bookmarkData.bookmarkedFoldersUuids.includes(folder?.uuid) ?  
  [ 
    { text: 'Remove from places', icon: 'remove-bookmark', handleOnClick: () => {
      dispatch(deleteBookmark({ userData, folderData: folder }));
      clipboardContext.setShallContextMenuClose(true);
    }},
    'line',
    { text: 'Cut', icon: 'cut', handleOnClick: clipboardContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => clipboardContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: clipboardContext.removeClickedElements },
  ] 
  : 
  [
    { text: 'Add to places', icon: 'add-bookmark', handleOnClick: () => {
      dispatch(createBookmark({ userData, folderData: folder }));
      clipboardContext.setShallContextMenuClose(true);
    }},
    'line',
    { text: 'Cut', icon: 'cut', handleOnClick: clipboardContext.cutClickedElements },
    { text: 'Rename', icon: 'rename', handleOnClick: () => clipboardContext.setIsRenaming(true) },
    'line',
    { text: 'Move to trash', icon: 'trash', handleOnClick: clipboardContext.removeClickedElements },
  ]


  return (
    <CommonContextMenu options={options} point={point}/>  
  );
};
