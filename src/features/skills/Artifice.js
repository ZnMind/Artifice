import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import Select from 'react-select';
import multipliers from '../json/Multipliers.json';
import styles from './Counter.module.css';

export function Artifice() {
    const dispatch = useDispatch();

    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [skill] = useState('Artifice');
    const [itemOptions, setItemOptions] = useState([]);
    const [action, setAction] = useState("");
    const [req, setReq] = useState(2);
    const [progress, setProgress] = useState('');
    const [timing, setTiming] = useState(0);
    const [mat, setMat] = useState("Log");
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [wepArray] = useState(['Bow', 'Knife', 'Sword', 'Axe', 'Pick', 'Rod', 'Helm', 'Chest', 'Gloves', 'Legs', 'Boots', 'Shield']);

    // Setting materials and excluding certain keys for input options
    const [materialOptions] = useState(
        Object.keys(items).flatMap(element => {
            if (element === 'Coins' || element === 'Stone' || element === 'Training') {
                return [];
            }
            // Checking if materials actually have an enhanceable item
            var hasReturned = false;
            return Object.keys(items[element]).flatMap(el => {
                if (wepArray.includes(el.split("+")[0])) {
                    if (items[element][el] > 0) {
                        if (!hasReturned) {
                            hasReturned = true;
                            return element;
                        }
                    }
                }
                return [];
            })
        }));

    const [material, setMaterial] = useState(materialOptions[0]);

    const [expTable] = useState({
        'Copper': { 'exp': 15, 'req': multipliers['Requirements']['Copper'], 'mat': 'Bar' },
        'Tin': { 'exp': 25, 'req': multipliers['Requirements']['Tin'], 'mat': 'Bar' },
        'Bronze': { 'exp': 40, 'req': multipliers['Requirements']['Bronze'], 'mat': 'Bar' },
        'Iron': { 'exp': 60, 'req': multipliers['Requirements']['Iron'], 'mat': 'Bar' },
        'Steel': { 'exp': 90, 'req': multipliers['Requirements']['Steel'], 'mat': 'Bar' },
        'Alumite': { 'exp': 120, 'req': multipliers['Requirements']['Alumite'], 'mat': 'Bar' },
        'Dragon': { 'exp': 250, 'req': multipliers['Requirements']['Dragon'], 'mat': 'Bar' },
        'Normal': { 'exp': 15, 'req': multipliers['Requirements']['Normal'], 'mat': 'Log' },
        'Oak': { 'exp': 35, 'req': multipliers['Requirements']['Oak'], 'mat': 'Log' },
        'Willow': { 'exp': 60, 'req': multipliers['Requirements']['Willow'], 'mat': 'Log' },
        'Teak': { 'exp': 70, 'req': multipliers['Requirements']['Teak'], 'mat': 'Log' },
        'Maple': { 'exp': 90, 'req': multipliers['Requirements']['Maple'], 'mat': 'Log' },
        'Yew': { 'exp': 120, 'req': multipliers['Requirements']['Yew'], 'mat': 'Log' },
        'Cow': { 'exp': 15, 'req': multipliers['Requirements']['Cow'], 'mat': 'Leather' },
        'Stag': { 'exp': 25, 'req': multipliers['Requirements']['Stag'], 'mat': 'Leather' },
        'Boar': { 'exp': 40, 'req': multipliers['Requirements']['Boar'], 'mat': 'Leather' },
        'Bear': { 'exp': 60, 'req': multipliers['Requirements']['Bear'], 'mat': 'Leather' },
        'Croc': { 'exp': 90, 'req': multipliers['Requirements']['Croc'], 'mat': 'Leather' },
        'Grizzly': { 'exp': 120, 'req': multipliers['Requirements']['Grizzly'], 'mat': 'Leather' },
    });

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Artifice === undefined) {
            dispatch(initialize({ skill: "Artifice" }));
        }
    }, []);

    // Not showing options if player doesn't have item
    useEffect(() => {
        setProgress('');

        if (expTable[material]) {
            setMat(expTable[material]['mat']);
        }

        if (items[material]) {
            setItemOptions(Object.keys(items[material]).flatMap(element => {
                if (wepArray.includes(element.split("+")[0])) {
                    if (items[material][element] > 0) {
                        return element;
                    }
                }
                return [];
            }))
        }
    }, [material, items[material]]);

    useEffect(() => {
        if (itemOptions) {
            setAction(itemOptions[0])
        } else {
            setAction("");
        }
    }, [itemOptions]);

    useEffect(() => {
        if (action) {
            if (action.split("+").length > 1) {
                const grade = parseInt(action.split("+")[1]);
                const tier = Math.floor((grade + 1) / 5);
                setReq((grade + 1) * (2 * (tier + 1)))
            } else {
                setReq(2);
            }
        }
    }, [action]);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            if (action.split("+").length > 1) {
                var grade = action.split("+")[1];
                dispatch(decrement({ material: material, item: action, amount: 1 }));
                dispatch(decrement({ material: material, item: mat, amount: req }));
                dispatch(increment({ material: material, item: `${action.split("+")[0]}+${parseInt(grade) + 1}`, amount: 1 }));
                dispatch(push(`Upgraded to ${material} ${action.split("+")[0]}+${parseInt(grade) + 1}! Amount: ${items[material] ? items[material][action] ? items[material][action] : 1 : 1}~`));
            } else {
                dispatch(decrement({ material: material, item: action, amount: 1 }));
                dispatch(decrement({ material: material, item: mat, amount: req }));
                dispatch(increment({ material: material, item: `${action}+1`, amount: 1 }));
                dispatch(push(`Upgraded to ${material} ${action}+1! Amount: ${items[material] ? items[material][action] ? items[material][action] : 1 : 1}~`));
            }
            // Stopping progress if out of materials
            if (items[material][action] <= 1 || items[material][mat] < req) {
                setProgress('');
                dispatch(push(`You ran out of ${material} ${action}.~`));
            }
            setMaterial(material);
            dispatch(gainExp({ skill: 'Artifice', amount: expTable[material]['exp'] * req }));
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
    const upgrade = type => {
        if (items[type][mat] >= req) {
            setProgress(type)
        } else {
            dispatch(push(`Not enough ${type} ${mat}.~`));
        }
        setTiming(1);
    }

    const handleMaterial = event => {
        setProgress('');
        setMaterial(event.value);
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

                <small>{`${material} ${mat}: ${items[material] ? items[material][mat] ? items[material][mat] : 0 : 0}`}</small>
            </div>

            <div className={styles.row}>
                <div className='craft-container'>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Select
                            placeholder={materialOptions[0]}
                            defaultValue={materialOptions[0]}
                            onChange={handleMaterial}
                            options={materialOptions.map(data => ({ value: data, label: data }))}
                            className='basic-multi-select'
                            classNamePrefix='select'
                        />
                        <Select
                            placeholder={action}
                            value={action}
                            onChange={handleAction}
                            options={itemOptions.map(data => ({ value: data, label: data }))}
                            className='basic-multi-select'
                            classNamePrefix='select'
                            styles={{ color: 'Red' }}
                        />
                    </div>
                    <div className='tree'>
                        <small>{action ? `${material} ${action}` : "No Items"}</small>
                        {
                            items[material] ?
                                action ?
                                    items[material][mat] >= req
                                        ? <small>{`Cost: ${req}`}</small>
                                        : <small style={{ color: 'red' }}>{`Cost: ${req}`}</small>
                                    : ""
                                : ""
                        }
                        {
                            expTable[material] ?
                                lvl >= expTable[material].req
                                    ? <button onClick={() => upgrade(material)} className={styles.button} id='tree'>Upgrade</button>
                                    : <small style={{ color: 'lightslategray' }}>{`Required: ${expTable[material].req}`}</small>
                                : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}