import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import multipliers from '../json/Multipliers.json';
import '../../App.css';

const Equipment = () => {
    const [slots] = useState(['Head', 'Chest', 'Gloves', 'Legs', 'Boots', 'Weapon', 'Offhand']);
    const [stats, setStats] = useState([]);
    const equip = useSelector(state => state.equipment);
    console.log(equip[0]);

    useEffect(() => {
        calculateBonus();
    }, []);

    const calculateBonus = () => {
        var atkAcc = 0,
            strAcc = 0,
            defAcc = 0,
            strBonus = 0;

        for (let i = 0; i < Object.keys(equip).length; i++) {
            var slot = equip[Object.keys(equip)[i]];
            if (slot !== "") {
                console.log(slot)
                var mat = multipliers.Materials[slot.split(" ")[0]];
                var type = multipliers.Style[slot.split(" ")[1]];

                console.log(mat)
                console.log(type)
                atkAcc = mat * type.Attack;
                strAcc = mat * type.Strength;
                defAcc = mat * type.Defense;
                strBonus = mat * type.Mult;
            }
        }

        setStats([ atkAcc, strAcc, defAcc, strBonus ]);
    };

    return (
        <div>
            <h2>Equipment</h2>
            <div>
                <small>{`A: ${stats[0]} D: ${stats[3]}`}</small>
            </div>
            <div>
                {slots.map((data, index) => (
                    <div key={index} className='equip'>
                        <p>{`${data}: `}</p>
                        <p>{`${equip[data]}`}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Equipment;