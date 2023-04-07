import { createSlice } from '@reduxjs/toolkit';
import { initialSkills } from './characterSlice';

export const skillBoosts = {
    Woodcutting: 'Beaver',
    Woodworking: 'Beaver',
    Mining: 'Mole',
    Smithing: 'Mole',
    Fishing: 'Heron',
    Cooking: 'Heron',
}

const petSlice = createSlice({
    name: 'pet',
    initialState: { equipped: '' },
    reducers: {
        gainPetExp(state, action) {
            let pet = action.payload.pet;
            let skill = action.payload.skill;
            state[pet][skill].experience += action.payload.amount;
            
            if (state[pet][skill].experience >= state[pet][skill].next) {
                state[pet][skill].last = state[pet][skill].next;
                state[pet][skill].next += Math.round(100 * Math.pow(2, (state[pet][skill].level / 8)));
                state[pet][skill].level += 1;
            }
        },
        initializePet(state, action) {
            state[action.payload.pet] = initialSkills;
        },
        equipPet(state, action) {
            state.equipped = action.payload.pet;
        }
    }
})

export const { gainPetExp, initializePet, equipPet } = petSlice.actions;

export default petSlice.reducer;