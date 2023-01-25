import { createSlice } from '@reduxjs/toolkit';

const bankSlice = createSlice({
    name: 'bank',
    initialState: { },
    reducers: {
        increment(state, action) {
            const material = action.payload.material;
            const item = action.payload.item;

            /* if (item in state) {
                state[item] += action.payload.amount;
            } else {
                state[item] = action.payload.amount;
            } */

            if (material in state) {
                if (item in state[material]) {
                    state[material][item] += action.payload.amount;
                } else {
                    state[material][item] = action.payload.amount;
                }
            } else {
                state[material] = { [item]: action.payload.amount }
            }

        },
        decrement(state, action) {
            const material = action.payload.material;
            const item = action.payload.item;

            state[material][item]--;
        },
    }
})

export const { increment, decrement } = bankSlice.actions;

export default bankSlice.reducer;