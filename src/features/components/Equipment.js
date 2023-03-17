import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unequip } from '../slices/equipmentSlice';
import { increment } from '../slices/bankSlice';
import { img, colorChange, loadSelect } from '../images/imageHelper';
import '../../App.css';

const Equipment = () => {
    const dispatch = useDispatch();
    const [slots] = useState(['Helm', 'Chest', 'Gloves', 'Legs', 'Boots', 'Weapon', 'Offhand']);
    const [hover, setHover] = useState("");
    const [stats, setStats] = useState([]);
    const equip = useSelector(state => state.equipment);
    const style = useSelector(state => state.combat.Style);

    const calculateBonus = () => {
        var atk = 0, def = 0, str = 0;
        for (let i = 0; i < Object.keys(equip).length - 1; i++) {
            var slot = equip[Object.keys(equip)[i]];
            atk += slot.Atk;
            def += slot.Def;
            str += slot.Str;
        }
        setStats([atk, def, str])
    };

    const mouseOver = item => {
        let slot = item.target.firstChild.innerText.split(":")[0];
        setHover(slot);
    }

    const handleUnequip = () => {
        let item = equip[hover].Name
        console.log(item);
        dispatch(unequip({ equipment: hover }));
        dispatch(increment({ material: item.split(" ")[0], item: item.split(" ")[1], amount: 1 }));
    }

    useEffect(() => {
        calculateBonus();
    }, [equip]);

    return (
        <div className='pbars'>
            <h2>Equipment</h2>
            <div>
                <small>{`Attack: ${stats[0]}, Defense: ${stats[1]}, Strength: ${stats[2]}`}</small>
            </div>
            <div >
                {slots.map((data, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginLeft: '76px' }}>
                        <div className='equip' onMouseEnter={e => mouseOver(e)}>
                            <p style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>{`${data}: `}</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginRight: '1rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>{`${equip[data].Name}`}</p>
                                {img[equip[data].Name.split("+")[0].split(" ")[1]]
                                    ? <object
                                        className='color-svg'
                                        data={img[equip[data].Name.split("+")[0].split(" ")[1]]} alt=''
                                        height='30px' width='30px' type='image/svg+xml'
                                        onLoad={colorChange}
                                    ></object>
                                    : ""}
                            </div>
                        </div>
                        {
                            hover === data
                                ? <button
                                    className='equip-btn'
                                    style={{ height: '50px', width: '76px', marginRight: '-76px', borderRadius: '5px' }}
                                    onClick={handleUnequip}
                                >Unequip</button>
                                : ""
                        }
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Equipment;