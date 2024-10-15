import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'state/slices/userSlice';
import { driveSlice } from 'state/slices/driveSlice';
import { currentFolderSlice } from 'state/slices/currentFolderSlice';
import { pathSlice } from 'state/slices/pathSlice';
import { clipboardSlice } from 'state/slices/clipboardSlice';
import { bookmarkSlice } from 'state/slices/bookmarkSlice';
import { settingsSlice } from 'state/slices/settingsSlice';


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    currentFolder: currentFolderSlice.reducer,
    path: pathSlice.reducer,
    clipboard: clipboardSlice.reducer,
    bookmark: bookmarkSlice.reducer,
    settings: settingsSlice.reducer,
  },
});