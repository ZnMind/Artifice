import { createSlice } from '@reduxjs/toolkit';

const combatSlice = createSlice({
    name: 'combat',
    initialState: {
        Hp: { current: 100, max: 100 },
        Accuracy: { Attack: 0, Strength: 0, Defense: 0 },
        Strength: 0,
    },
    reducers: {
        updateHp(state, action) {
            state.Hp.current += action.payload;
        },
        resetHp(state) {
            state.Hp.current = state.Hp.max;
        },
    }
})

export const { updateHp, resetHp } = combatSlice.actions;

export default combatSlice.reducer;