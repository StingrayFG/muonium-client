import { createSlice } from '@reduxjs/toolkit'

import config from 'config.json';


const saveSettings = (state) => {
  localStorage.setItem('settings', JSON.stringify(state));
}


export const settingsSlice = createSlice({
  name: 'path',
  initialState: {
    ...config.defaultSettings,
    ...JSON.parse(localStorage.getItem('settings')),
  },
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      saveSettings(state); 
    }, 
    setSidePanelWidth: (state, action) => {
      state.sidePanelWidth = action.payload;
      saveSettings(state); 
    }, 
    setSidePanelIsVisible: (state, action) => {
      state.sidePanelIsVisible = action.payload;
      saveSettings(state); 
    }, 
    setElementSize: (state, action) => {
      state.elementSize = action.payload;
      saveSettings(state); 
    }, 
  },
});

export const { setViewMode, setSidePanelWidth, setSidePanelIsVisible, setElementSize } = settingsSlice.actions;