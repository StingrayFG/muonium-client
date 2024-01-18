import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'services/slice/UserSlice.jsx';
import { driveSlice } from 'services/slice/DriveSlice.jsx';
import { pathSlice } from 'services/slice/PathSlice.jsx';
import { clipboardSlice } from 'services/slice/ClipboardSlice.jsx';
import { bookmarkSlice } from 'services/slice/BookmarkSlice.jsx';
import { settingsSlice } from 'services/slice/SettingsSlice.jsx';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    path: pathSlice.reducer,
    clipboard: clipboardSlice.reducer,
    bookmark: bookmarkSlice.reducer,
    settings: settingsSlice.reducer,
  },
});