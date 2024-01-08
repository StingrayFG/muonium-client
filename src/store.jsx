import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from 'services/slice/UserSlice.jsx';
import { pathSlice } from 'services/slice/PathSlice.jsx';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    path: pathSlice.reducer,
  },
});