import { createSlice } from '@reduxjs/toolkit';

const progressSlice = createSlice({
    name: 'progress',
    initialState: { now: 0 },
    reducers: {
        increment(state, action) {
            state.now += action.payload;
        },
        reset(state) {
            state.now = 0;
        }
    }
})

export const { increment, reset } = progressSlice.actions;

export const selectNormal = (state) => state.now;

export default progressSlice.reducer;