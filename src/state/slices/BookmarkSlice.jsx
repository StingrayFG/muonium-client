import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import BookmarkService from 'services/BookmarkService'


export const createBookmark = createAsyncThunk(
  'bookmark/create',
  async ({ userData, bookmarkData }, thunkAPI) => {
    return await BookmarkService.handleCreate(userData, bookmarkData);
  },
);

export const getBookmarks = createAsyncThunk(
  'bookmark/get',
  async (userData, thunkAPI) => {
    return await BookmarkService.handleGet(userData);
  },
);

export const deleteBookmark = createAsyncThunk(
  'bookmark/delete',
  async ({ userData, bookmarkData }, thunkAPI) => {
    return await BookmarkService.handleDelete(userData, bookmarkData);
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
        bookmarks: action.payload, 
        bookmarkedFoldersUuids: action.payload.map(bookmark => bookmark.folderUuid) 
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