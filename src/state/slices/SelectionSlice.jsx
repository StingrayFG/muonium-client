import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    elements: [],
  },
  reducers: {
    setElements:(state, action) => {
      state.elements = action.payload;
    }, 
  },
});

export const { setElements, setCounts } = selectionSlice.actions;