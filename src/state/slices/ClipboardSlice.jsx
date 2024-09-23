import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState: {
    mode: '',
    elements: [],
    cutElementsUuids: [],
    originParentUuid: '',
    destinationParentUuid: '',
  },
  reducers: {
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