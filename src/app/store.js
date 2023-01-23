import { configureStore } from '@reduxjs/toolkit';
import { loadState } from '../localStorage';
import progressReducer from '../features/utils/progressSlice';
import characterReducer from '../features/utils/characterSlice';
import bankReducer from '../features/utils/bankSlice';
import consoleReducer from '../features/utils/consoleSlice';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    character: characterReducer,
    bank: bankReducer,
    console: consoleReducer,
  },
  preloadedState: persistedState
});