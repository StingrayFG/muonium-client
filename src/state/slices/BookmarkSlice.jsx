import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createBookmark = createAsyncThunk(
  'bookmark/create',
  async ({ userData, folderData }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData, folderData };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/create', body, {headers})
    return(res.data);  
  },
);

export const getBookmarks = createAsyncThunk(
  'bookmark/get',
  async (userData, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/get', body, {headers})
    return(res.data);  
  },
);

export const deleteBookmark = createAsyncThunk(
  'bookmark/delete',
  async ({ userData, folderData }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData, folderData };
    
    const res = await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmark/delete', body, {headers})
    return(res.data);  
  },
);

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: {
    doesRequireUpdate: true,
    bookmarks: [],
    bookmarkedFoldersUuids: [],
  },
  reducers: {
    confirmUpdate: (state) => {
      state.doesRequireUpdate = false;
    },
    requestUpdate: (state) => {
      state.doesRequireUpdate = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBookmark.fulfilled, (state) => {
      return { ...state, doesRequireUpdate: true };
    });
    builder.addCase(getBookmarks.fulfilled, (state, action) => {
      return { ...state, doesRequireUpdate: false, bookmarks: action.payload.bookmarksData, 
        bookmarkedFoldersUuids: action.payload.bookmarksData.map(b => b.folder.uuid) };
    });
    builder.addCase(getBookmarks.pending, (state, action) => {
      return { ...state, doesRequireUpdate: false };
    });
    builder.addCase(deleteBookmark.fulfilled, (state) => {
      return { ...state, doesRequireUpdate: true };
    });
  },
});

export const { confirmUpdate, requestUpdate } = bookmarkSlice.actions;