import { createSlice } from '@reduxjs/toolkit'

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
    copyToClipboard:(state, action) => {
      state.elements = action.payload.elements;
      state.originParentUuid = action.payload.originUuid;
      state.mode = 'copy';
    }, 
    cutToClipboard:(state, action) => {
      state.elements = action.payload.elements;
      state.cutElementsUuids = state.elements.map(element => element.uuid);
      state.originParentUuid = action.payload.originUuid;
      state.mode = 'cut';
    }, 
    clearClipboard:(state, action) => {
      state.elements = [];
      state.cutElementsUuids = [];
      state.mode = '';
    }, 
  },
});

export const { setCounts, setElements, copyToClipboard, cutToClipboard, clearClipboard } = clipboardSlice.actions;