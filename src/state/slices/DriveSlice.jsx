import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { instance } from 'services/AxiosInstance';


export const getDrive = createAsyncThunk(
  'drive/get',
  async (userData, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${ userData.accessToken }`};
    const body  = { userData };
    
    const res = await instance.post('/drive/get/', body, { headers })
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
      return action.payload.driveData;
    });
  },
});

export const {} = driveSlice.actions;