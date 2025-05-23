import { createSlice } from '@reduxjs/toolkit'

export const pathSlice = createSlice({
  name: 'path',
  initialState: {
    currentAbsolutePath: '',
    currentUuid: '',
    positionInHistory: 0,
    pathHistory: [],
  },
  reducers: {
    setAbsolutePath:(state, action) => {
      state.currentAbsolutePath = action.payload;
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
    },
    moveToNext: (state) => {
      state.positionInHistory += 1;
      state.currentUuid = state.pathHistory[state.positionInHistory];
    },
    moveToPrevious: (state) => {
      state.positionInHistory -= 1;
      state.currentUuid = state.pathHistory[state.positionInHistory];
    },
  },
});

export const { setAbsolutePath, setInitialUuid, moveToNew, moveToNext, moveToPrevious } = pathSlice.actions;