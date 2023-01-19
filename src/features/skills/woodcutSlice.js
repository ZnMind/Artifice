import { createSlice } from '@reduxjs/toolkit';

const woodcutSlice = createSlice({
    name: 'woodcut',
    initialState: { normal: 0, oak: 0, willow: 0 },
    reducers: {
        incrementNormal(state) {
            state.normal++;
        },
        decrementNormal(state) {
            state.normal--;
        },
        incrementOak(state) {
            state.oak++;
        },
        decrementOak(state) {
            state.oak--;
        },
        incrementWillow(state) {
            state.willow++;
        },
        decrementWillow(state) {
            state.willow--;
        },
    }
})

export const { incrementNormal, decrementNormal, incrementOak, incrementWillow } = woodcutSlice.actions;

export const selectNormal = (state) => state.normal;

export default woodcutSlice.reducer;