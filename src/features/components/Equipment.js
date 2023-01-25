import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../App.css';

const Equipment = () => {
    const [slots] = useState(['Head', 'Chest', 'Gloves', 'Legs', 'Boots', 'Weapon', 'Offhand']);
    const equip = useSelector(state => state.equipment);
    console.log(equip)

    return (
        <div>
            <h2>Equipment</h2>
            <div>
                Atk:
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