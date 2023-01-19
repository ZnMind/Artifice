import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
    name: 'character',
    initialState: {
        woodcutting: {
            level: 1,
            experience: 0,
            last: 0,
            next: 75
        }
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
            state.woodcutting.experience += action.payload;
        },
        getLast(state) {
            state.woodcutting.last = state.woodcutting.next;
        },
        calcNext(state, action) {
            state.woodcutting.next += action.payload;
        }
    }
})

export const { levelUp, gainExp, calcNext, getLast } = characterSlice.actions;

export default characterSlice.reducer;