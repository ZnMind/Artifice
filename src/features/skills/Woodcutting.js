import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import styles from './Counter.module.css';

export function Woodcutting() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);
    const bonus = useSelector(state => state.equipment.Bonus.Axe);

    const [page, setPage] = useState(1);
    const [action, setAction] = useState('');
    const [timing, setTiming] = useState(0);
    const [skill] = useState('Woodcutting');
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [speedBonus, setSpeedBonus] = useState(Math.round((bonus / 2 + 100 + ((lvl - 1) / 2) * (1 + (bonus / 100))) * 100) / 100);
    const [expTable] = useState({
        'Normal': { 'exp': 20, 'req': 1, 'timing': 1 },
        'Oak': { 'exp': 35, 'req': 15, 'timing': 2 },
        'Willow': { 'exp': 65, 'req': 30, 'timing': 3 },
        'Teak': { 'exp': 75, 'req': 35, 'timing': 3 },
        'Maple': { 'exp': 90, 'req': 45, 'timing': 4 },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Woodcutting === undefined) {
            dispatch(initialize({ skill: "Woodcutting" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            dispatch(gainExp({ skill: 'Woodcutting', amount: expTable[action].exp }));
            dispatch(increment({ material: action, item: 'Log', amount: 1 }));
            dispatch(push(`Chopped ${action} log! Amount: ${items[action] ? items[action]['Log'] + 1 : 1}~`))
        }
    }, [bar]);

    // Checking for level up and dispatching console message
    useEffect(() => {
        if (character[skill]) {
            if (character[skill].level > lvl) {
                dispatch(push(`Congrats you leveled up! ${skill} level ${character[skill].level}~`))
                setLvl(lvl + 1);
                setSpeedBonus(100 + (lvl / 2) * (1 + (bonus / 100)))
            }
        }
    }, [character[skill]]);

    // Setting time for progress bar to fill
    const chop = type => {
        setAction(type);
        setTiming(expTable[type].timing)
    }

    return (
        <div className='pbars'>
            <h2>{skill}</h2>
            <Progress
                action={action}
                timing={timing}
                bonus={speedBonus / 100}
            />
            <div className='exp'>
                <small>Level: {`${character[skill] === undefined ? 1 : character[skill].level}`}</small>
                <small>Exp: {character[skill] === undefined ? `0 / 75` : `${character[skill].experience} / ${character[skill].next}`}</small>
            </div>
            <div className='p-container'></div>

            <div className={styles.row}>
                <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} onClick={() => setPage(page - 1)}></div>
                <div className='container'>
                    {Object.keys(expTable).slice(page * 4 - 4, page * 4).map((data, index) => (
                        <div key={index} className='tree'>
                            <p>{data}</p>
                            <small>{`${Math.round(((2.5 + expTable[data].timing * 2.5) / (speedBonus / 100)) * 100) / 100}s`}</small>
                            {
                                lvl >= expTable[data].req
                                    ? <button onClick={() => chop(data)} className={styles.button} id='tree'>Chop</button>
                                    : <small style={{
                                        color: 'lightslategray',
                                        marginTop: '25px',
                                        marginBottom: '25px'
                                    }}>{`Required: ${expTable[data].req}`}</small>
                            }
                        </div>
                    ))}
                </div>
                <div className={`arrow ${page === 2 ? 'disabled' : 'arrow-right'}`} onClick={() => setPage(page + 1)}></div>
            </div>
        </div>
    );
}