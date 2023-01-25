import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../slices/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import Select from 'react-select';
import styles from './Counter.module.css';

export function Smithing() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [skill] = useState('Smithing');
    const [material, setMaterial] = useState('Copper');
    const [action, setAction] = useState('Bar');
    const [progress, setProgress] = useState('none');
    const [timing, setTiming] = useState(0);
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [itemOptions] = useState(['Bar', 'Knife', 'Sword', 'Axe']);
    const [expTable] = useState({
        'Copper': { 'exp': 15, 'req': 1 },
        'Tin': { 'exp': 25, 'req': 5 },
        'Bronze': { 'exp': 40, 'req': 10 },
        'Iron': { 'exp': 60, 'req': 20 },
        'Steel': { 'exp': 90, 'req': 30 },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Smithing === undefined) {
            dispatch(initialize({ skill: "Smithing" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            // Stopping progress if out of materials
            if (action === 'Bar') {
                dispatch(decrement({ material: material, item: 'Ore' }));
                dispatch(push(`Smithed ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
                if (items[material]['Ore'] <= 1) {
                    setProgress('none');
                    dispatch(push(`You ran out of ${material} Ore.~`));
                }
            } else {
                dispatch(decrement({ material: material, item: 'Bar' }));
                dispatch(push(`Smithed ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
                if (items[material]['Bar'] <= 1) {
                    setProgress('none');
                    dispatch(push(`You ran out of ${material} Bars.~`));
                }
            }
            dispatch(gainExp({ skill: 'Smithing', amount: expTable[material]['exp'] }));
            dispatch(increment({ material: material, item: action, amount: 1 }));
        }
    }, [bar]);

    // Resetting progress bar on material change
    useEffect(() => {
        setProgress('none');
    }, [material]);

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
    const smith = type => {
        if (action === 'Bar') {
            if (items[type]['Ore'] !== 0) {
                setProgress(type);
            } else {
                dispatch(push(`You ran out of ${type} Ore.~`));
            }
        } else {
            if (items[type]['Bar'] !== 0) {
                setProgress(type)
            } else {
                dispatch(push(`You ran out of ${type} Bars.~`));
            }
        }

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

    const handleAction = event => {
        setProgress('none');
        setAction(event.value);
    }

    return (
        <div className='pbars'>
            <h2>{skill}</h2>
            <Progress
                action={progress}
                timing={timing}
            />
            <div className='exp'>
                <small>Level: {`${character[skill] === undefined ? 1 : character[skill].level}`}</small>
                <small>Exp: {character[skill] === undefined ? `0 / 75` : `${character[skill].experience} / ${character[skill].next}`}</small>
                <div>
                    <button className={styles.button} onClick={() => setMaterial('Copper')}>Copper</button>
                    <button className={styles.button} onClick={() => setMaterial('Tin')}>Tin</button>
                    <button className={styles.button} onClick={() => setMaterial('Bronze')}>Bronze</button>
                    <button className={styles.button} onClick={() => setMaterial('Iron')}>Iron</button>
                    {/* <button className={styles.button} onClick={() => setMaterial('Steel')}>Steel</button> */}
                </div>
                <small>{
                    items[material]
                        ? action === 'Bar'
                            ? items[material]['Ore'] ? `${material} Ore: ${items[material]['Ore']}` : `${material} Ore: 0`
                            : items[material]['Bar'] ? `${material} Bar: ${items[material]['Bar']}` : `${material} Bar: 0`
                        : `${material} Ore: 0`
                }</small>
            </div>

            <div className={styles.row}>
                <div className='craft-container'>
                    <Select
                        placeholder={itemOptions[0]}
                        defaultValue={itemOptions[0]}
                        onChange={handleAction}
                        options={itemOptions.map(data => ({ value: data, label: data }))}
                        className='basic-multi-select'
                        classNamePrefix='select'
                    />
                    <div className='tree'>
                        <small>{`${material} ${action}`}</small>
                        <small>5s</small>
                        {
                            lvl >= expTable[material].req
                                ? <button onClick={() => smith(material)} className={styles.button} id='tree'>Smith</button>
                                : <small>{`Required: ${expTable[material].req}`}</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}