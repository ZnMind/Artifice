import { createSlice } from '@reduxjs/toolkit';

const bankSlice = createSlice({
    name: 'bank',
    initialState: { Coins: 0, Stone: { Axe: 1, Pick: 1 } },
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

            state[material][item] -= action.payload.amount;
        },
        sell(state, action) {
            const material = action.payload.material;
            const item = action.payload.item;

            state[material][item] -= action.payload.amount;
            state.Coins += action.payload.coins;
        }
    }
})

export const { increment, decrement, sell } = bankSlice.actions;

export default bankSlice.reducer;