import { configureStore } from '@reduxjs/toolkit';
import { loadState } from '../localStorage';
import progressReducer from '../features/utils/progressSlice';
import characterReducer from '../features/utils/characterSlice';
import woodcutReducer from '../features/skills/woodcutSlice';
import consoleReducer from '../features/utils/consoleSlice';

const persistedState = loadState();
console.log(persistedState)

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    character: characterReducer,
    woodcut: woodcutReducer,
    console: consoleReducer,
  },
  preloadedState: persistedState
});