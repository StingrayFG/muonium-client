import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'state/slices/UserSlice';
import { driveSlice } from 'state/slices/DriveSlice';
import { currentFolderSlice } from 'state/slices/CurrentFolderSlice';
import { pathSlice } from 'state/slices/PathSlice';
import { clipboardSlice } from 'state/slices/ClipboardSlice';
import { bookmarkSlice } from 'state/slices/BookmarkSlice';
import { settingsSlice } from 'state/slices/SettingsSlice';
import { selectionSlice } from 'state/slices/SelectionSlice';


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    currentFolder: currentFolderSlice.reducer,
    path: pathSlice.reducer,
    clipboard: clipboardSlice.reducer,
    bookmark: bookmarkSlice.reducer,
    settings: settingsSlice.reducer,
    selection: selectionSlice.reducer,
  },
});