import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createBookmark = createAsyncThunk(
  'bookmark/create',
  async ({ userData, folder }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userUuid: userData.userUuid, folderUuid: folder.uuid };
    
    const res = axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/create', body, {headers})
    return(res.data);  
  },
);

export const getBookmarks = createAsyncThunk(
  'bookmark/get',
  async (userData, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userUuid: userData.userUuid };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/get', body, {headers})
    return(res.data);  
  },
);

export const deleteBookmark = createAsyncThunk(
  'bookmark/delete',
  async ({ userData, folder }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userUuid: userData.userUuid, folderUuid: folder.uuid };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/delete', body, {headers})
    return(res.data);  
  },
);

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: {
    requiresUpdate: true,
    bookmarks: [],
    bookmarkedFoldersUuids: [],
  },
  reducers: {
    confirmUpdate: (state) => {
      state.requiresUpdate = false;
    },
    requestUpdate: (state) => {
      state.requiresUpdate = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBookmark.fulfilled, (state) => {
      return { requiresUpdate: true };
    });
    builder.addCase(getBookmarks.fulfilled, (state, action) => {
      return { requiresUpdate: false, bookmarks: action.payload, bookmarkedFoldersUuids: action.payload.map(b => b.folder.uuid) };
    });
    builder.addCase(deleteBookmark.fulfilled, (state) => {
      return { requiresUpdate: true };
    });
  },
});

export const { confirmUpdate, requestUpdate } = bookmarkSlice.actions;