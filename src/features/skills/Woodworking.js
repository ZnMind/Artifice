import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import Select from 'react-select';
import styles from './Counter.module.css';

export function Woodworking() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [skill] = useState('Woodworking');
    const [material, setMaterial] = useState('Normal');
    const [action, setAction] = useState('Plank');
    const [progress, setProgress] = useState('');
    const [timing, setTiming] = useState(0);
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [page, setPage] = useState(1);
    const [itemOptions] = useState(['Plank', 'Rod', 'Shield']);
    const [expTable] = useState({
        'Normal': { 'exp': 15, 'req': 1, 'log': { 'Normal Log': 1 } },
        'Oak': { 'exp': 25, 'req': 5, 'log': { 'Oak Log': 1 } },
        'Willow': { 'exp': 40, 'req': 15, 'log': { 'Willow Log': 1 } },
        'Teak': { 'exp': 60, 'req': 30, 'log': { 'Teak Log': 1 } },
        'Maple': { 'exp': 90, 'req': 40, 'log': { 'Maple Log': 1 } },
        'Yew': { 'exp': 150, 'req': 50, 'log': { 'Yew Log': 1 } },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Woodworking === undefined) {
            dispatch(initialize({ skill: "Woodworking" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            // Stopping progress if out of materials
            if (action === 'Plank') {
                var matReqs = Object.keys(expTable[material].log);
                for (let i = 0; i < matReqs.length; i++) {
                    var wood = matReqs[i].split(" ")[0];
                    dispatch(decrement({ material: wood, item: 'Log', amount: 1 }));
                    if (items[wood]['Log'] <= 1) {
                        setProgress('');
                        dispatch(push(`You ran out of ${wood} Logs.~`));
                    }
                }
                dispatch(push(`Cut ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
            } else {
                dispatch(decrement({ material: material, item: 'Plank', amount: 1 }));
                dispatch(push(`Cut ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
                if (items[material]['Plank'] <= 1) {
                    setProgress('');
                    dispatch(push(`You ran out of ${material} Planks.~`));
                }
            }
            dispatch(gainExp({ skill: 'Woodworking', amount: expTable[material]['exp'] }));
            dispatch(increment({ material: material, item: action, amount: 1 }));
        }
    }, [bar]);

    // Resetting progress bar on material change
    useEffect(() => {
        setProgress('');
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
    const fletch = type => {
        var materialCheck = [];

        if (action === 'Plank') {
            Object.keys(expTable[type]['log']).forEach(i => {
                if (items[i.split(" ")[0]]) {
                    //if (items[i.split(" ")[0]]['Ore']) {
                    if (items[i.split(" ")[0]]['Log'] >= expTable[type]['log'][i]) {
                        materialCheck.push(true);
                    } else {
                        materialCheck.push(false);
                    }
                    //}
                } else {
                    materialCheck.push(false);
                }
            })

            if (materialCheck.every(Boolean)) {
                setProgress(type);
            } else {
                dispatch(push(`You ran out of logs.~`));
            }
        } else {
            if (items[type]) {
                if (items[type]['Plank']) {
                    if (items[type]['Plank'] !== 0) {
                        setProgress(type)
                    } else {
                        dispatch(push(`You ran out of ${type} Planks.~`));
                    }
                }
            } else {
                dispatch(push(`You ran out of ${type} Bars.~`));
            }
        }

        setTiming(1);
    }

    const handleAction = event => {
        setProgress('');
        setAction(event.value);
    }

    return (
        <div className='pbars'>
            <h2>{skill}</h2>
            <Progress
                action={progress}
                timing={timing}
                bonus={1}
            />
            <div className='exp'>
                <small>Level: {`${character[skill] === undefined ? 1 : character[skill].level}`}</small>
                <small>Exp: {character[skill] === undefined ? `0 / 75` : `${character[skill].experience} / ${character[skill].next}`}</small>
                <div className='sm-container'>
                    <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} style={{ marginRight: '0.5em' }} onClick={() => setPage(page - 1)}></div>
                    {Object.keys(expTable).slice(page * 4 - 4, page * 4).map((data, index) => (
                        <button key={index} className={styles.button} style={{ marginTop: '0' }} onClick={() => setMaterial(data)}>{data}</button>
                    ))}
                    <div className={`arrow ${page === 2 ? 'disabled' : 'arrow-right'}`} style={{ marginLeft: '0.5em' }} onClick={() => setPage(page + 1)}></div>
                </div>

                {
                    action === 'Plank'
                        ? Object.keys(expTable[material]['log']).map((d, i) => (
                            <small key={i}>
                                {

                                    items[d.split(" ")[0]]
                                        ? items[d.split(" ")[0]]['Log']
                                            ? `${d}: ${items[d.split(" ")[0]]['Log']}`
                                            : `${d}: 0`
                                        : `${d}: 0`
                                }
                            </small>
                        ))
                        : <small>{
                            items[material]
                                ? items[material]['Plank']
                                    ? `${material} Plank: ${items[material]['Plank']}`
                                    : `${material} Plank: 0`
                                : `${material} Plank: 0`
                        }</small>
                }
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
                                ? <button onClick={() => fletch(material)} className={styles.button} id='tree'>Fletch</button>
                                : <small style={{ color: 'lightslategray' }}>{`Required: ${expTable[material].req}`}</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}