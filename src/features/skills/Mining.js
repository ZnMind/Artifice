import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import styles from './Counter.module.css';

export function Mining() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [page, setPage] = useState(1);
    const [action, setAction] = useState('');
    const [timing, setTiming] = useState(0);
    const [skill] = useState('Mining');
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [expTable] = useState({
        'Copper': { 'exp': 15, 'req': 1, 'timing': 5 },
        'Tin': { 'exp': 20, 'req': 5, 'timing': 5 },
        'Iron': { 'exp': 40, 'req': 15, 'timing': 10 },
        'Coal': { 'exp': 60, 'req': 30, 'timing': 15 },
        'Mithril': { 'exp': 60, 'req': 30, 'timing': 15 },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Mining === undefined) {
            dispatch(initialize({ skill: "Mining" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            dispatch(gainExp({ skill: 'Mining', amount: expTable[action].exp }));
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
        <div className='pbars'>
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
            <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} onClick={() => setPage(page - 1)}></div>
                <div className='container'>
                    {Object.keys(expTable).slice(page * 4 - 4, page * 4).map((data, index) => (
                        <div key={index} className='tree'>
                            <p>{data}</p>
                            <small>{`${expTable[data].timing}s`}</small>
                            {
                                lvl >= expTable[data].req
                                    ? <button onClick={() => mine(data)} className={styles.button} id='tree'>Mine</button>
                                    : <small>{`Required: ${expTable[data].req}`}</small>
                            }
                        </div>
                    ))}
                </div>
                <div className={`arrow ${page === 2 ? 'disabled' : 'arrow-right'}`} onClick={() => setPage(page + 1)}></div>
            </div>
        </div>
    );
}