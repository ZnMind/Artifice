import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import multipliers from '../json/Multipliers.json';
import '../../App.css';

const Equipment = () => {
    const [slots] = useState(['Head', 'Back', 'Chest', 'Gloves', 'Legs', 'Boots', 'Weapon', 'Offhand']);
    const [stats, setStats] = useState([]);
    const equip = useSelector(state => state.equipment);
    const style = useSelector(state => state.combat.Style);

    useEffect(() => {
        calculateBonus();
    }, []);

    const calculateBonus = () => {
        var atk = 0, def = 0, str = 0;
            for (let i = 0; i < Object.keys(equip).length - 1; i++) {
                var slot = equip[Object.keys(equip)[i]];
                    atk += slot.Atk;
                    def += slot.Def;
                    str += slot.Str;
            }
            setStats([ atk, def, str ])
    };

    return (
        <div>
            <h2>Equipment</h2>
            <div>
                <small>{`Attack: ${stats[0]}, Defense: ${stats[1]}, Strength: ${stats[2]}`}</small>
            </div>
            <div>
                {slots.map((data, index) => (
                    <div key={index} className='equip' onMouseEnter={e => mouseOver(e)}>
                        <p>{`${data}: `}</p>
                        <p>{`${equip[data].Name}`}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

const mouseOver = item => {
    var slot = item.target.firstChild.innerText.split(":")[0];
    console.log(slot);

    /* return (
        <div style={{ position: 'absolute', top: 0, color: 'white' }}>
            <p>1234</p>
        </div>
    ) */
}

export default Equipment;