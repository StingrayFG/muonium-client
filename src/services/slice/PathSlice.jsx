import { createSlice } from '@reduxjs/toolkit'

export const pathSlice = createSlice({
  name: 'path',
  initialState: {
    currentAbsolutePath: '',
    currentUuid: '',
    positionInHistory: 0,
    pathHistory: [],
    doesRequireUpdate: true,
  },
  reducers: {
    setAbsolutePath:(state, action) => {
      state.currentAbsolutePath = action.payload.currentAbsolutePath;
    }, 
    setInitialUuid:(state, action) => {
      state.pathHistory.push(action.payload.uuid);
      state.currentUuid = action.payload.uuid;
    }, 
    moveToNew: (state, action) => {
      if (state.currentUuid !== action.payload.uuid) {
        state.pathHistory = state.pathHistory.slice(0, state.positionInHistory + 1)
        state.pathHistory.push(action.payload.uuid);
        state.currentUuid = action.payload.uuid;
        state.positionInHistory += 1;
      }
      state.doesRequireUpdate = true;
    },
    moveToNext: (state) => {
      state.positionInHistory += 1;
      state.currentUuid = state.pathHistory[state.positionInHistory];
      state.doesRequireUpdate = true;
    },
    moveToPrevious: (state) => {
      state.positionInHistory -= 1;
      state.currentUuid = state.pathHistory[state.positionInHistory];
      state.doesRequireUpdate = true;
    },
    confirmUpdate: (state) => {
      state.doesRequireUpdate = false;
    },
    requestUpdate: (state) => {
      state.doesRequireUpdate = true;
    },
  },
});

export const { setAbsolutePath, setInitialUuid, moveToNew, moveToNext, moveToPrevious, confirmUpdate, requestUpdate } = pathSlice.actions;