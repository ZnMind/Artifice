import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../utils/Progress';
import { gainExp, initialize } from '../utils/characterSlice';
import { increment } from '../utils/bankSlice';
import { push } from '../utils/consoleSlice';
import styles from './Counter.module.css';

export function Mining() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [action, setAction] = useState('');
    const [timing, setTiming] = useState(0);
    const [skill] = useState('Mining');
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [expTable] = useState({ 'Copper': 15, 'Tin': 15, 'Iron': 40, 'Coal': 60 });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Mining === undefined) {
            dispatch(initialize({ skill: "Mining" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            dispatch(gainExp({ skill: 'Mining', amount: expTable[action]}));
            dispatch(increment({ material: action, item: 'Ore', amount: 1 }));
            dispatch(push(`Mined ${action} ore! Amount: ${items[action] ? items[action]['Ore'] + 1 : 1}~`))
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
    const mine = type => {
        setAction(type);
        switch (type) {
            case 'Copper':
                setTiming(2);
                break;
            case 'Tin':
                setTiming(2);
                break;
            case 'Iron':
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
                        <p>Copper</p>
                        <small>5s</small>
                        <button onClick={() => mine('Copper')} className={styles.button} id='tree'>Mine</button>
                    </div>
                    <div className='tree'>
                        <p>Tin</p>
                        <small>5s</small>
                        <button onClick={() => mine('Tin')} className={styles.button} id='tree'>Mine</button>
                    </div>
                    <div className='tree'>
                        <p>Iron</p>
                        <small>10s</small>
                        {character.level >= 30
                            ? <button onClick={() => mine('Iron')} className={styles.button} id='tree'>Mine</button>
                            : <small>Required: 15</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}