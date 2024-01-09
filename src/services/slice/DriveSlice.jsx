import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getDrive = createAsyncThunk(
  'drive/get',
  async (driveUuid, thunkAPI) => {
    const driveData = { driveUuid };
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/drive/get', { uuid: driveUuid })
    return res.data;
  },
);

export const driveSlice = createSlice({
  name: 'drive',
  initialState: {
    uuid: '1',
    ownerUuid: '1',
    spaceTotal: 1,
    spaceUsed: 1,
  },
  extraReducers: (builder) => {
    builder.addCase(getDrive.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const {} = driveSlice.actions;