import { createSlice } from '@reduxjs/toolkit';
import multipliers from '../json/Multipliers.json';

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        Helm: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Back: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Chest: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Gloves: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Legs: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Boots: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Weapon: { Name: 'Training Sword', Atk: 5, Def: 0, Str: 5 },
        Offhand: { Name: '', Atk: 0, Def: 0, Str: 0 },
        Bonus: {
            Axe: 0,
            Pick: 0,
            Rod: 0
        }
    },
    reducers: {
        equip(state, action) {
            const equipment = action.payload.equipment;
            const item = action.payload.item;
            var base, str, def, multi;

            base = multipliers['Materials'][item.split(" ")[0]]
            if (equipment === 'Weapon') {
                str = Math.round(multipliers['Style'][item.split(" ")[1].split("+")[0]].Mult * base);
                if (item.split("+").length > 1) {
                    multi = 1 + parseInt(item.split("+")[1]) / 10;
                    base = Math.round(base * multi);
                    str = Math.round(str * multi);
                }
                
                if (['Axe', 'Pick', 'Rod'].some(element => item.includes(element))) {
                    state['Bonus'][item.split(" ")[1].split("+")[0]] = base;
                }
                
                state[equipment] = { Name: item, Atk: base, Def: 0, Str: str };
            } else {
                def = Math.round(multipliers['Style'][item.split(" ")[1].split("+")[0]] * base);
                if (item.split("+").length > 1) {
                    multi = 1 + parseInt(item.split("+")[1]) / 10;
                    def = Math.round(def * multi);
                }
                state[equipment] = { Name: item, Atk: 0, Def: def, Str: 0 };
            }
        },
        unequip(state, action) {
            const equipment = action.payload.equipment;

            state[equipment] = { Name: '', Atk: 0, Def: 0, Str: 0 };
            state['Bonus'] = { Axe: 0, Pick: 0, Rod: 0 }
        },
    }
})

export const { equip, unequip } = equipmentSlice.actions;

export default equipmentSlice.reducer;