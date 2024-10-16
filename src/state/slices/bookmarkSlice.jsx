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


const parseToObject = (state) => {
  return JSON.parse(JSON.stringify(state))
}


export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: {
    bookmarks: [],
    bookmarkedFoldersUuids: [],
  },
  reducers: {
    addBookmarksOnClient: (state, action) => {
      let newBookmarks = [...parseToObject(state.bookmarks), ...action.payload]

      return { 
        ...state, 
        bookmarks: newBookmarks, 
        bookmarkedFoldersUuids: newBookmarks.map(bookmark => bookmark.folderUuid) 
      };
    },
    updateBookmarksOnClient: (state, action) => {
      let newBookmarks = parseToObject(state.bookmarks);

      for (const element of action.payload) {
        newBookmarks.find((bookmark, index) => {
          if (bookmark.uuid === element.uuid) {
            newBookmarks[index] = { ...element, originalBookmark: newBookmarks[index] };
          }
        })
      }

      return { 
        ...state, 
        bookmarks: newBookmarks, 
        bookmarkedFoldersUuids: newBookmarks.map(bookmark => bookmark.folderUuid) 
      };
    },
    revertUpdateBookmarksOnClient: (state, action) => {
      let newBookmarks = parseToObject(state.bookmarks);

      for (const element of action.payload) {
        newBookmarks.find((bookmark, index) => {
          if (bookmark.uuid === element.uuid) {
            newBookmarks[index] = bookmark.originalBookmark;
          }
        })
      }

      return { 
        ...state, 
        bookmarks: newBookmarks, 
        bookmarkedFoldersUuids: newBookmarks.map(bookmark => bookmark.folderUuid) 
      };
    },
    deleteBookmarksOnClient: (state, action) => {
      let newBookmarks = parseToObject(state.bookmarks);

      const bookmarksUuids = action.payload.map(bookmark =>bookmark.uuid);

      newBookmarks = newBookmarks.filter(bookmark => (!bookmarksUuids.includes(bookmark.uuid)))

      return { 
        ...state, 
        bookmarks: newBookmarks, 
        bookmarkedFoldersUuids: newBookmarks.map(bookmark => bookmark.folderUuid) 
      };
    },
  },
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

export const { addBookmarksOnClient, updateBookmarksOnClient, revertUpdateBookmarksOnClient, deleteBookmarksOnClient } = bookmarkSlice.actions;