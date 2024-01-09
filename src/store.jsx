import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'services/slice/UserSlice.jsx';
import { driveSlice } from 'services/slice/DriveSlice.jsx';
import { pathSlice } from 'services/slice/PathSlice.jsx';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    drive: driveSlice.reducer,
    path: pathSlice.reducer,
  },
});