import { createSlice } from '@reduxjs/toolkit';

const consoleSlice = createSlice({
    name: 'console',
    initialState: {
        console: 'Welcome!~'
    },
    reducers: {
        push(state, action) {
            if (state.console.split("~").length > 5) {
                state.console = state.console.split("~").slice(1).join("~")
            }
            state.console += action.payload;
        },
    }
})

export const { push } = consoleSlice.actions;

export default consoleSlice.reducer;