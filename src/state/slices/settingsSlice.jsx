import { createSlice } from '@reduxjs/toolkit'

import config from 'config.json';


export const settingsSlice = createSlice({
  name: 'path',
  initialState: {
    ...config.defaultSettings,
    ...JSON.parse(localStorage.getItem('settings')),
  },
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      localStorage.setItem('settings', JSON.stringify(state));  
    }, 
    setSidePanelWidth: (state, action) => {
      state.sidePanelWidth = action.payload;
      localStorage.setItem('settings', JSON.stringify(state));  
    }, 
  },
});

export const { setViewMode, setSidePanelWidth } = settingsSlice.actions;