import { createSlice } from '@reduxjs/toolkit'

import config from 'config.json';


const saveSettings = (state) => {
  localStorage.setItem('settings', JSON.stringify(state));
}

const parseToObject = (state) => {
  return JSON.parse(JSON.stringify(state))
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
    setSidePanelIsOverlayMode: (state, action) => {
      state.sidePanelIsOverlayMode = action.payload;
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
    setColumnPosition: (state, action) => {
      let newListViewColumns = parseToObject(state).listViewColumns
      const columnIndex = state.listViewColumns.findIndex(column => column.name === action.payload.column.name)

      newListViewColumns.splice(columnIndex, 1);
      newListViewColumns = [
        ...newListViewColumns.slice(0, action.payload.position),
        action.payload.column,
        ...newListViewColumns.slice(action.payload.position),
      ]
      
      state.listViewColumns = newListViewColumns;
      saveSettings(state); 
    }, 

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      saveSettings(state); 
    }, 
    setSortByAscending: (state, action) => {
      state.sortByAscending = action.payload;
      saveSettings(state); 
    }, 
    setShowFoldersFirst: (state, action) => {
      state.showFoldersFirst = action.payload;
      saveSettings(state); 
    }, 
  },
});

export const { setViewMode, setSidePanelWidth, 
  setSidePanelIsVisible, setSidePanelIsOverlayMode, 
  setGridElementWidth, setListElementHeight, 
  setColumnWidth, setColumnIsEnabled, setColumnPosition,
  setSortBy, setSortByAscending, setShowFoldersFirst } = settingsSlice.actions;