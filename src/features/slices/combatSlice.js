import { createSlice } from '@reduxjs/toolkit';

const combatSlice = createSlice({
    name: 'combat',
    initialState: {
        Hp: { current: 100, max: 100 },
        Accuracy: { Attack: 0, Strength: 0, Defense: 0 },
        Strength: 0,
        Style: 'Attack',
    },
    reducers: {
        updateHp(state, action) {
            state.Hp.current += action.payload;
        },
        updateMax(state, action) {
            state.Hp.max = action.payload;
        },
        resetHp(state) {
            state.Hp.current = state.Hp.max;
        },
        currentStyle(state, action) {
            state.Style = action.payload;
        }
    }
})

export const { updateHp, updateMax, resetHp, currentStyle } = combatSlice.actions;

export default combatSlice.reducer;