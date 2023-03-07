import { createSlice } from '@reduxjs/toolkit';

const artificeSlice = createSlice({
    name: 'artifice',
    initialState: {  },
    reducers: {
        increment(state, action) {
            const material = action.payload.material;
            const item = action.payload.item;

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

export const { increment, decrement, sell } = artificeSlice.actions;

export default artificeSlice.reducer;