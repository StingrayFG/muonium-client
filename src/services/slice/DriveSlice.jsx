import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getDrive = createAsyncThunk(
  'drive/get',
  async (userData, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body  = { userUuid: userData.userUuid, driveUuid: userData.driveUuid };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/drive/get', body, {headers})
    return res.data;
  },
);

export const driveSlice = createSlice({
  name: 'drive',
  initialState: {
    uuid: '',
    ownerUuid: '',
    spaceTotal: 0,
    spaceUsed: 0,
  },
  extraReducers: (builder) => {
    builder.addCase(getDrive.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const {} = driveSlice.actions;