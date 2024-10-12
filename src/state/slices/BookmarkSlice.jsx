import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const createBookmark = createAsyncThunk(
  'bookmark/create',
  async ({ userData, bookmarkData }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData, bookmarkData };

    const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/create', body, { headers })
    return(res.data);  
  },
);

export const getBookmarks = createAsyncThunk(
  'bookmark/get',
  async (userData, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData };
    
    const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/get', body, { headers })
    return(res.data);  
  },
);

export const deleteBookmark = createAsyncThunk(
  'bookmark/delete',
  async ({ userData, bookmarkData }, thunkAPI) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userData, bookmarkData };

    const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/delete', body, { headers })
    return(res.data);  
  },
);

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: {
    bookmarks: [],
    bookmarkedFoldersUuids: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBookmarks.fulfilled, (state, action) => {
      return { 
        ...state, 
        bookmarks: action.payload.bookmarksData, 
        bookmarkedFoldersUuids: action.payload.bookmarksData.map(bookmark => bookmark.folderUuid) 
      };
    });

    builder.addCase(createBookmark.pending, (state, action) => {
      return { 
        ...state, 
        bookmarks: [ ...state.bookmarks, action.meta.arg.bookmarkData ],
        bookmarkedFoldersUuids: [ ...state.bookmarkedFoldersUuids, action.meta.arg.bookmarkData.folderUuid ] 
      };
    });
    builder.addCase(createBookmark.rejected, (state, action) => {
      return { 
        ...state, 
        bookmarks: state.bookmarks.filter(bookmark => bookmark.uuid !== action.meta.arg.bookmarkData.uuid),
        bookmarkedFoldersUuids: state.bookmarkedFoldersUuids.filter(folderUuid => folderUuid !== action.meta.arg.bookmarkData.folderUuid)
      };
    });

    builder.addCase(deleteBookmark.pending, (state, action) => {
      return { 
        ...state, 
        bookmarks: state.bookmarks.filter(bookmark => bookmark.uuid !== action.meta.arg.bookmarkData.uuid),
        bookmarkedFoldersUuids: state.bookmarkedFoldersUuids.filter(folderUuid => folderUuid !== action.meta.arg.bookmarkData.folderUuid)
      };
    });
    builder.addCase(deleteBookmark.rejected, (state, action) => {
      return { 
        ...state, 
        bookmarks: [ ...state.bookmarks, action.meta.arg.bookmarkData ],
        bookmarkedFoldersUuids: [ ...state.bookmarkedFoldersUuids, action.meta.arg.bookmarkData.folderUuid ] 
      };
    });
  },
});

export const {} = bookmarkSlice.actions;