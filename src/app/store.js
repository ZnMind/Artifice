import { configureStore } from '@reduxjs/toolkit';
import { loadState } from '../localStorage';
import progressReducer from '../features/slices/progressSlice';
import characterReducer from '../features/slices/characterSlice';
import bankReducer from '../features/slices/bankSlice';
import equipmentReducer from '../features/slices/equipmentSlice';
import consoleReducer from '../features/slices/consoleSlice';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    character: characterReducer,
    bank: bankReducer,
    equipment: equipmentReducer,
    console: consoleReducer,
  },
  preloadedState: persistedState
});