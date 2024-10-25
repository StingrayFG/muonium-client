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
    setSidePanelWidth: (state, action) => {
      state.sidePanelWidth = action.payload;
      saveSettings(state); 
    }, 
    setSidePanelIsVisible: (state, action) => {
      state.sidePanelIsVisible = action.payload;
      saveSettings(state); 
    }, 

    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      saveSettings(state); 
    }, 
    setGridElementWidth: (state, action) => {
      state.gridElementWidth = action.payload;
      saveSettings(state); 
    }, 
    setListElementHeight: (state, action) => {
      state.listElementHeight = action.payload;
      saveSettings(state); 
    }, 
    setColumnWidth: (state, action) => {
      state.listViewColumns.find(column => {
        if (column.name === action.payload.name) {
          column.width = action.payload.width
        }
      })
      saveSettings(state); 
    }, 
    setColumnIsEnabled: (state, action) => {
      state.listViewColumns.find(column => {
        if (column.name === action.payload.name) {
          column.isEnabled = action.payload.isEnabled
        }
      })
      saveSettings(state); 
    }, 
  },
});

export const { setViewMode, setSidePanelWidth, 
  setSidePanelIsVisible, setGridElementWidth, setListElementHeight, 
  setColumnWidth, setColumnIsEnabled } = settingsSlice.actions;