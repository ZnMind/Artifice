import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import Select from 'react-select';
import styles from './Counter.module.css';

export function Crafting() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [skill] = useState('Crafting');
    const [material, setMaterial] = useState('Cow');
    const [action, setAction] = useState('Leather');
    const [progress, setProgress] = useState('');
    const [timing, setTiming] = useState(0);
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [page, setPage] = useState(1);
    const [itemOptions] = useState(['Leather', 'Helm', 'Chest', 'Gloves', 'Legs', 'Boots']);
    const [expTable] = useState({
        'Cow': { 'exp': 15, 'req': 1, 'hide': { 'Cow Hide': 1 } },
        'Stag': { 'exp': 25, 'req': 5, 'hide': { 'Stag Hide': 1 } },
        'Boar': { 'exp': 40, 'req': 15, 'hide': { 'Boar Hide': 1 } },
        'Bear': { 'exp': 60, 'req': 30, 'hide': { 'Bear Hide': 1 } },
        'Croc': { 'exp': 90, 'req': 40, 'hide': { 'Croc Hide': 1 } },
        'Grizzly': { 'exp': 120, 'req': 50, 'hide': { 'Grizzly Hide': 1 } },
        'Dragon': { 'exp': 250, 'req': 60, 'hide': { 'Dragon Hide': 1 } },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Crafting === undefined) {
            dispatch(initialize({ skill: "Crafting" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            // Stopping progress if out of materials
            if (action === 'Leather') {
                var matReqs = Object.keys(expTable[material].hide);
                for (let i = 0; i < matReqs.length; i++) {
                    var metal = matReqs[i].split(" ")[0];
                    dispatch(decrement({ material: metal, item: 'Hide', amount: 1 }));
                    if (items[metal]['Hide'] <= 1) {
                        setProgress('');
                        dispatch(push(`You ran out of ${metal} Hide.~`));
                    }
                }
                dispatch(push(`Tanned ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
            } else {
                dispatch(decrement({ material: material, item: 'Leather', amount: 1 }));
                dispatch(push(`Crafted ${material} ${action}! Amount: ${items[material] ? items[material][action] ? items[material][action] + 1 : 1 : 1}~`));
                if (items[material]['Leather'] <= 1) {
                    setProgress('');
                    dispatch(push(`You ran out of ${material} Leather.~`));
                }
            }
            dispatch(gainExp({ skill: 'Crafting', amount: expTable[material]['exp'] }));
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
    const craft = type => {
        var materialCheck = [];
        if (action === 'Leather') {
            Object.keys(expTable[type]['hide']).forEach(i => {
                if (items[i.split(" ")[0]]) {
                    if (items[i.split(" ")[0]]['Hide'] >= expTable[type]['hide'][i]) {
                        materialCheck.push(true);
                    } else {
                        materialCheck.push(false);
                    }
                } else {
                    materialCheck.push(false);
                }
            })
            if (materialCheck.every(Boolean)) {
                setProgress(type);
            } else {
                dispatch(push(`You ran out of hide.~`));
            }
        } else {
            if (items[type]) {
                if (items[type]['Leather']) {
                    if (items[type]['Leather'] !== 0) {
                        setProgress(type)
                    } else {
                        dispatch(push(`You ran out of ${type} Leather.~`));
                    }
                }
            } else {
                dispatch(push(`You ran out of ${type} Leather.~`));
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
                    <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} style={{marginRight: '0.5em'}} onClick={() => setPage(page - 1)}></div>
                    {Object.keys(expTable).slice(page * 4 - 4, page * 4).map((data, index) => (
                        <button key={index} className={styles.button} style={{marginTop: '0'}} onClick={() => setMaterial(data)}>{data}</button>
                    ))}
                    <div className={`arrow ${page === 2 ? 'disabled' : 'arrow-right'}`} style={{marginLeft: '0.5em'}} onClick={() => setPage(page + 1)}></div>
                </div>

                {
                    action === 'Leather'
                        ? Object.keys(expTable[material]['hide']).map((d, i) => (
                            <small key={i}>
                                {
                                    items[d.split(" ")[0]]
                                        ? `${d}: ${items[d.split(" ")[0]]['Hide']}`
                                        : `${d}: 0`
                                }
                            </small>
                        ))
                        : <small>{
                            items[material]
                                ? items[material]['Leather']
                                    ? `${material} Leather: ${items[material]['Leather']}`
                                    : `${material} Leather: 0`
                                : `${material} Leather: 0`
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
                        <small>{`xp: ${expTable[material].exp}`}</small>
                        {
                            lvl >= expTable[material].req
                                ? <button onClick={() => craft(material)} className={styles.button} id='tree'>Craft</button>
                                : <small style={{ color: 'lightslategray', marginTop: '25px', marginBottom: '25px' }}>{`Required: ${expTable[material].req}`}</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}