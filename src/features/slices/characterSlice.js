import { createSlice } from '@reduxjs/toolkit';

export const initialSkills = {
    Hitpoints: { level: 10, experience: 1279, last: 0, next: 1497 },
    Attack: { level: 1, experience: 0, last: 0, next: 75 },
    Strength: { level: 1, experience: 0, last: 0, next: 75 },
    Defense: { level: 1, experience: 0, last: 0, next: 75 },
    Woodcutting: { level: 1, experience: 0, last: 0, next: 75 },
    Woodworking: { level: 1, experience: 0, last: 0, next: 75 },
    Mining: { level: 1, experience: 0, last: 0, next: 75 },
    Smithing: { level: 1, experience: 0, last: 0, next: 75 },
    Fishing: { level: 1, experience: 0, last: 0, next: 75 },
    Cooking: { level: 1, experience: 0, last: 0, next: 75 },
    Artifice: { level: 1, experience: 0, last: 0, next: 75 },
    Lapidary: { level: 1, experience: 0, last: 0, next: 75 },
    Crafting: { level: 1, experience: 0, last: 0, next: 75 },
};

const characterSlice = createSlice({
    name: 'character',
    initialState: initialSkills,
    reducers: {
        gainExp(state, action) {
            let skill = action.payload.skill;
            state[skill].experience += action.payload.amount;
            
            if (state[skill].experience >= state[skill].next) {
                state[skill].last = state[skill].next;
                state[skill].next += Math.round(100 * Math.pow(2, (state[skill].level / 8)));
                state[skill].level += 1;
            }
        },
        // Having fun with preloadedState in store overriding initial state (for older saves) and newer skills are undefined. This should fix it
        /* Update: added IIFE to store.js that should make this reducer superfluous */
        initialize(state, action) {
            state[action.payload.skill] = { level : 1, experience: 0, last: 0, next: 75 };
        }
    }
})

export const { gainExp, initialize } = characterSlice.actions;

export default characterSlice.reducer;