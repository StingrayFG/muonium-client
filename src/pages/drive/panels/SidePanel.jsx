import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { moveToNew } from 'state/slices/PathSlice';
import { getBookmarks } from 'state/slices/BookmarkSlice';

import { FolderContext } from 'contexts/FolderContext.jsx';

import BookmarkElement from 'pages/drive/elements/BookmarkElement.jsx';


export default function SidePanel () {
  const folderContext = useContext(FolderContext);
  
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const bookmarkData = useSelector(state => state.bookmark);

  const moveToUuid = (uuid) => {
    dispatch(moveToNew({ uuid }));
  }

  const [bookmarks, setBookmarks] = useState();

  useEffect(() => {
    if (!bookmarkData.bookmarks) {
      dispatch(getBookmarks(userData));
    }
  }, [])

  useEffect(() => {
    if (bookmarks !== bookmarkData.bookmarks) {
      setBookmarks(bookmarkData.bookmarks);
    }
  }, [bookmarkData.bookmarks])

  return (
    <Box className='w-64 max-h-full overflow-y-auto
    scrollbar scrollbar-sky-300/20 scrollbar-corner-sky-300/20 scrollbar-track-transparent
    border-r border-sky-300/20'>
      <Box className='w-full h-8 px-2 flex 
      opacity-50
      select-none pointer-events-none'
      onClick={() => {moveToUuid('home')}}>
        <p className='place-self-center'>Places</p>
      </Box>

      <BookmarkElement bookmark={{ folder: { uuid: 'home', name:'Home' } }}/>

      <BookmarkElement bookmark={{ folder: { uuid: 'trash', name:'Trash' } }}/>

      <Box className='w-full h-8 px-2 flex 
      opacity-50
      select-none pointer-events-none'
      onClick={() => {moveToUuid('home')}}>
        <p className='place-self-center'>Bookmarks</p>
      </Box>

      {bookmarks && <>
        {bookmarks.map((bookmark) => (
          <BookmarkElement key={bookmark.uuid} bookmark={bookmark}/>
        ))}
      </>}
    </Box>
  );
}