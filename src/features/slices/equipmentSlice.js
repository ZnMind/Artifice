import { createSlice } from '@reduxjs/toolkit';

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        Head: '',
        Chest: '',
        Gloves: '',
        Legs: '',
        Boots: '',
        Weapon: 'Training Sword',
        Offhand: '',
    },
    reducers: {
        equip(state, action) {
            const equipment = action.payload.equipment;
            const item = action.payload.item;

            state[equipment] = item;
        },
        unequip(state, action) {
            const equipment = action.payload.equipment;

            state[equipment] = '';
        },
    }
})

export const { equip, unequip } = equipmentSlice.actions;

export default equipmentSlice.reducer;