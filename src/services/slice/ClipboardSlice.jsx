import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const clipboardSlice = createSlice({
  name: 'drive',
  initialState: {
    clickedElements: [],
    filesCount: 0,
    foldersCount: 0,
    mode: '',
    elements: [],
    cutElementsUuids: [],
    originParentUuid: '',
    destinationParentUuid: '',
  },
  reducers: {
    setElements:(state, action) => {
      state.clickedElements = action.payload;
    }, 
    setCounts:(state, action) => {
      state.filesCount = action.payload.filesCount;
      state.foldersCount = action.payload.foldersCount;
    },
    setCopy:(state, action) => {
      state.elements = action.payload.elements;
      state.originParentUuid = action.payload.originUuid;
      state.mode = 'copy';
    }, 
    setCut:(state, action) => {
      state.elements = action.payload.elements;
      state.cutElementsUuids = state.elements.map(e => e.uuid);
      state.originParentUuid = action.payload.originUuid;
      state.mode = 'cut';
    }, 
    setPaste:(state, action) => {
      state.elements = [];
      state.cutElementsUuids = [];
      state.mode = '';
    }, 
  },
});

export const { setCounts, setElements, setCopy, setCut, setPaste } = clipboardSlice.actions;