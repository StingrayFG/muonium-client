import { createSlice } from '@reduxjs/toolkit'

export const pathSlice = createSlice({
  name: 'path',
  initialState: {
    absolutePath: '',
    currentPath: '',
    positionInHistory: 0,
    pathHistory: [],
    requiresUpdate: true,
  },
  reducers: {
    setAbsolutePath:(state, path) => {
      state.absolutePath = path.payload.absolutePath;
    }, 
    setInitial:(state, path) => {
      state.pathHistory.push(path.payload.uuid);
      state.currentPath = path.payload.uuid;
    }, 
    moveToNew: (state, path) => {
      state.pathHistory = state.pathHistory.slice(0, state.positionInHistory + 1)
      state.pathHistory.push(path.payload.uuid);
      state.currentPath = path.payload.uuid;
      state.positionInHistory += 1;
      state.requiresUpdate = true;
    },
    moveToNext: (state) => {
      state.positionInHistory += 1;
      state.currentPath = state.pathHistory[state.positionInHistory];
      state.requiresUpdate = true;
    },
    moveToPrevious: (state) => {
      state.positionInHistory -= 1;
      state.currentPath = state.pathHistory[state.positionInHistory];
      state.requiresUpdate = true;
    },
    confirmUpdate: (state) => {
      state.requiresUpdate = false;
    },
    requestUpdate: (state) => {
      state.requiresUpdate = true;
    },
  },
});

export const { setAbsolutePath, setInitial, moveToNew, moveToNext, moveToPrevious, confirmUpdate, requestUpdate } = pathSlice.actions;