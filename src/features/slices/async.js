import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchTodos = createAsyncThunk('/', async () => {
    const response = await fetch('http://localhost:5000').then(data => data.json());
    console.log(response)
    return response
})

const todosSlice = createSlice({
    name: 'todos',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                const newEntities = {}
                action.payload.forEach(todo => {
                    newEntities[todo.id] = todo
                })
                state.entities = newEntities
                state.status = 'idle'
            })
    }
})

export const todosReducer = todosSlice.reducer