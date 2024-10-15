import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import BookmarkElement from 'pages/drive/elements/BookmarkElement.jsx';


export default function SidePanel () {
  const bookmarkData = useSelector(state => state.bookmark);

  return (
    <Box className='w-64 max-h-full overflow-y-auto
    scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent
    border-r border-sky-300/20'>

      <Box className='w-full h-8 px-2 flex 
      opacity-50
      select-none pointer-events-none'>
        <p className='place-self-center'>Places</p>
      </Box>

      <BookmarkElement bookmark={{ folder: { uuid: 'home', name:'Home' } }}/>

      <BookmarkElement bookmark={{ folder: { uuid: 'trash', name:'Trash' } }}/>

      <Box className='w-full h-8 px-2 flex 
      opacity-50
      select-none pointer-events-none'>
        <p className='place-self-center'>Bookmarks</p>
      </Box>

      {bookmarkData.bookmarks.map((bookmark) => (
        <BookmarkElement key={bookmark.uuid} bookmark={bookmark}/>
      ))}

    </Box>
  );
}