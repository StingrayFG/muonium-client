import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    elements: [],
    filesCount: 0,
    foldersCount: 0,
  },
  reducers: {
    setElements:(state, action) => {
      state.elements = action.payload;
    }, 
    setCounts:(state, action) => {
      state.filesCount = action.payload.filesCount;
      state.foldersCount = action.payload.foldersCount;
    },
  },
});

export const { setElements, setCounts } = selectionSlice.actions;