import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'state/slices/UserSlice.jsx';
import { driveSlice } from 'state/slices/DriveSlice.jsx';
import { pathSlice } from 'state/slices/PathSlice.jsx';
import { clipboardSlice } from 'state/slices/ClipboardSlice.jsx';
import { bookmarkSlice } from 'state/slices/BookmarkSlice.jsx';
import { settingsSlice } from 'state/slices/SettingsSlice.jsx';
import { selectionSlice } from 'state/slices/SelectionSlice.jsx';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    path: pathSlice.reducer,
    clipboard: clipboardSlice.reducer,
    bookmark: bookmarkSlice.reducer,
    settings: settingsSlice.reducer,
    selection: selectionSlice.reducer,
  },
});