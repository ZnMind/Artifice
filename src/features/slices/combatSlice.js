import { createSlice } from '@reduxjs/toolkit';

const combatSlice = createSlice({
    name: 'combat',
    initialState: {
        Hp: { current: 100, max: 100 },
        Accuracy: { Attack: 0, Strength: 0, Defense: 0 },
        Strength: 0,
    },
    reducers: {
        updateStats(state, action) {
            
        },
    }
})

export const { updateStats } = combatSlice.actions;

export default combatSlice.reducer;