import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'services/slice/UserSlice.jsx';
import { driveSlice } from 'services/slice/DriveSlice.jsx';
import { pathSlice } from 'services/slice/PathSlice.jsx';
import { clipboardSlice } from 'services/slice/ClipboardSlice.jsx';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    path: pathSlice.reducer,
    clipboard: clipboardSlice.reducer,
  },
});