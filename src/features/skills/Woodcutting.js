import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../utils/Progress';
import { gainExp, initialize } from '../utils/characterSlice';
import { increment } from '../utils/bankSlice';
import { push } from '../utils/consoleSlice';
import styles from './Counter.module.css';

export function Woodcutting() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [action, setAction] = useState('');
    const [timing, setTiming] = useState(0);
    const [skill] = useState('Woodcutting');
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [expTable] = useState({ 'Normal': 20, 'Oak': 40, 'Willow': 60, 'Maple': 80 });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Woodcutting === undefined) {
            dispatch(initialize({ skill: "Woodcutting" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            dispatch(gainExp({ skill: 'Woodcutting', amount: expTable[action] }));
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
            }
        }
    }, [character[skill]]);

    // Setting time for progress bar to fill
    const chop = type => {
        setAction(type);
        switch (type) {
            case 'Normal':
                setTiming(2);
                break;
            case 'Oak':
                setTiming(2);
                break;
            case 'Willow':
                setTiming(1);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <h2>{skill}</h2>
            <Progress
                action={action}
                timing={timing}
            />
            <div className='exp'>
                <small>Level: {`${character[skill] === undefined ? 1 : character[skill].level}`}</small>
                <small>Exp: {character[skill] === undefined ? `0 / 75` : `${character[skill].experience} / ${character[skill].next}`}</small>
            </div>

            <div className={styles.row}>
                <div className='container'>
                    <div className='tree'>
                        <p>Normal</p>
                        <small>5s</small>
                        <button onClick={() => chop('Normal')} className={styles.button} id='tree'>Chop</button>
                    </div>
                    <div className='tree'>
                        <p>Oak</p>
                        <small>5s</small>
                        {
                            character.level >= 15
                                ? <button onClick={() => chop('Oak')} className={styles.button} id='tree'>Chop</button>
                                : <small>Required: 15</small>
                        }
                    </div>
                    <div className='tree'>
                        <p>Willow</p>
                        <small>10s</small>
                        {
                            character.level >= 30
                                ? <button onClick={() => chop('Willow')} className={styles.button} id='tree'>Chop</button>
                                : <small>Required: 30</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}