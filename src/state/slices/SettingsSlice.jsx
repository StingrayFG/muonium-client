import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'path',
  initialState: JSON.parse(localStorage.getItem('settings')) || {
    type: 'grid',
  },
  reducers: {
    setType:(state, action) => {
      state.type = action.payload;
      localStorage.setItem('settings', JSON.stringify(state));  
    }, 
  },
});

export const { setType } = settingsSlice.actions;