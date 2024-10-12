import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ login, password }, thunkAPI) => {
    const userData = { login, password };
    const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/auth/login', { userData })
    return res.data;
  },
);

export const signupUser = createAsyncThunk(
  'user/signup',
  async ({ login, password }, thunkAPI) => {
    const userData = { login, password };
    const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/auth/signup', { userData })
    return res.data;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: JSON.parse(localStorage.getItem('user')),
  reducers: {
    clearUser: (state) => {
      localStorage.removeItem('user');
      return null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(action.payload)
      localStorage.setItem('user', JSON.stringify(action.payload.userData));  
      return action.payload.userData;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      return action.payload;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      return null;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      return action.payload;
    });
  },
});

export const { clearUser } = userSlice.actions;