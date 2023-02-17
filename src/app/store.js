import { configureStore } from '@reduxjs/toolkit';
import { loadState } from '../localStorage';
import { initialSkills } from '../features/slices/characterSlice';
import progressReducer from '../features/slices/progressSlice';
import characterReducer from '../features/slices/characterSlice';
import bankReducer from '../features/slices/bankSlice';
import equipmentReducer from '../features/slices/equipmentSlice';
import consoleReducer from '../features/slices/consoleSlice';
import combatReducer from '../features/slices/combatSlice';

// I'm writing this function to combine a preloaded state and initial state.
// It checks if initial state object has keys that persisted state doesn't and then adds those in.
// This is to avoid errors in the case of adding new skills to the game.
const combineStates = (() => {
  var persistedState = loadState();

  if (persistedState) {
    Object.keys(initialSkills).forEach(element => {
      if (persistedState.character[element] === undefined) {
        persistedState.character[element] = initialSkills[element];
      }
    })

    if (persistedState.bank.Coins === null) {
      persistedState.bank.Coins = 0;
    }
  }
  return persistedState;
})();

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    character: characterReducer,
    bank: bankReducer,
    equipment: equipmentReducer,
    combat: combatReducer,
    console: consoleReducer,
  },
  preloadedState: combineStates
});