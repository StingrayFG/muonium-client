import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { deleteBookmark } from 'state/slices/bookmarkSlice';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu';


export default function BookmarkContextMenu ({ bookmark }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);

  const contextMenuContext = useContext(ContextMenuContext)

  const options = [
    { text: 'Remove from places', icon: 'remove-bookmark', handleOnClick: () => {
      dispatch(deleteBookmark({ 
        userData, 
        bookmarkData: bookmark
      }));
      contextMenuContext.setIsContextMenu(false);
    }}
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
