import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moveToNew } from 'services/slice/PathSlice';
import { getBookmarks } from 'services/slice/BookmarkSlice';

import { FolderContext } from 'components/drive/context/FolderContext.jsx';

import BookmarkElement from 'components/drive/element/BookmarkElement.jsx';

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
    const get = async () => {
      if (userData && bookmarkData.doesRequireUpdate) {
        await dispatch(getBookmarks(userData));
      }
    }
    get();
  })

  useEffect(() => {
    if (bookmarks !== bookmarkData.bookmarks) {
      setBookmarks(bookmarkData.bookmarks);
    }
  })

  return (
    <div className='w-96 max-h-full overflow-y-auto scrollbar scrollbar-thumb-zinc-300 scrollbar-corner-zinc-300 scrollbar-track-transparent
    border-solid border-r-2 border-zinc-800
    text-2xl font-semibold font-sans text-neutral-200'>
      <div className='w-full h-12 px-3 flex text-left text-zinc-400 select-none pointer-events-none'
      onClick={() => {moveToUuid('home')}}>
        <p className='place-self-center'>Places</p>
      </div>

      <button className='w-full h-12 px-3 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={() => {moveToUuid('home')}}>
        <img src='/icons/house.svg' alt='home' width='28' className='place-self-center'/>
        <p className='ml-2 place-self-center'>Home</p>
      </button>

      <button className='w-full h-12 px-3 flex text-left 
      hover:bg-gradient-to-b hover:from-sky-200/50 hover:to-sky-400/50 rounded'
      onClick={() => {moveToUuid('trash')}}>
        <img src='/icons/trash.svg' alt='trash' width='28' className='place-self-center mt-1'/>
        <p className='ml-2 place-self-center'>Trash</p>
      </button>

      <div className='w-full h-12 mt-4 px-3 flex text-left text-zinc-400 select-none pointer-events-none'
      onClick={() => {moveToUuid('home')}}>
        <p className='place-self-center'>Bookmarks</p>
      </div>

      {bookmarks && <>
        {bookmarks.map((bookmark) => (
          <BookmarkElement key={bookmark.uuid} bookmark={bookmark}/>
        ))}
      </>}
    </div>
  );
}