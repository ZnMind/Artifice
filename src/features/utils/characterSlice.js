import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
    name: 'character',
    initialState: {
        Woodcutting: { level: 1, experience: 0, last: 0, next: 75 },
        Mining: { level: 1, experience: 0, last: 0, next: 75 },
        Smithing: { level: 1, experience: 0, last: 0, next: 75 },
    },
    reducers: {
        levelUp(state) {
            state.woodcutting.level++;
            console.log(state.woodcutting.level)
            /* let nextLv = 100 * Math.round(Math.pow(2, state.woodcutting.level / 8))
            state.woodcutting.next += nextLv;
            console.log(state.woodcutting.next) */
        },
        gainExp(state, action) {
            let skill = action.payload.skill;
            state[skill].experience += action.payload.amount;
            
            if (state[skill].experience >= state[skill].next) {
                state[skill].last = state[skill].next;
                state[skill].next += Math.round(100 * Math.pow(2, (state[skill].level / 8)));
                state[skill].level += 1;
            }
        },
        getLast(state) {
            state.woodcutting.last = state.woodcutting.next;
        },
        calcNext(state, action) {
            state.woodcutting.next += action.payload;
        },
        // Having fun with preloadedState in store overriding initial state (for older saves) and newer skills are undefined. This should fix it
        initialize(state, action) {
            state[action.payload.skill] = { level : 1, experience: 0, last: 0, next: 75 };
        }
    }
})

export const { levelUp, gainExp, calcNext, getLast, initialize } = characterSlice.actions;

export default characterSlice.reducer;