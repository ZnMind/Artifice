import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../components/Progress';
import { gainExp, initialize } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import Select from 'react-select';
import styles from './Counter.module.css';

export function Cooking() {
    const dispatch = useDispatch();
    const bar = useSelector(state => state.progress);
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);

    const [skill] = useState('Cooking');
    const [progress, setProgress] = useState('');
    const [timing, setTiming] = useState(0);
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);
    const [burn, setBurn] = useState();

    // Setting materials and excluding certain keys for input options
    const [material, setMaterial] = useState('Chicken');
    const [expTable] = useState({
        'Chicken': { 'exp': 30, 'req': 1, 'burn': 34 },
        'Beef': { 'exp': 50, 'req': 5, 'burn': 34 },
        'Venison': { 'exp': 60, 'req': 10, 'burn': 44 },
        'Boar': { 'exp': 70, 'req': 15, 'burn': 49 },
        'Bear': { 'exp': 90, 'req': 20, 'burn': 54 },
        'Croc': { 'exp': 110, 'req': 30, 'burn': 64 },
        'Grizzly': { 'exp': 150, 'req': 40, 'burn': 74 }, 
    });
    const [materialOptions] = useState(Object.keys(expTable));

    // Attempting to initialize state for older saves
    useEffect(() => {
        if (character.Cooking === undefined) {
            dispatch(initialize({ skill: "Cooking" }));
        }
    }, []);

    // Adding experience && items when bar is full
    useEffect(() => {
        if (bar.now >= 100) {
            let rand = Math.random() * 100;
            if (rand <= burn) {
                dispatch(decrement({ material: 'Raw', item: material, amount: 1 }));
                dispatch(increment({ material: 'Cooked', item: material, amount: 1 }));
                dispatch(push(`Cooked ${material}! Amount: ${items['Cooked'] ? items['Cooked'][material] ? items['Cooked'][material] + 1 : 1 : 1}~`));
                dispatch(gainExp({ skill: skill, amount: expTable[material]['exp'] }));
            } else {
                dispatch(decrement({ material: 'Raw', item: material, amount: 1 }));
                dispatch(push(`Oops! You burned the ${material}!~`));
            }
            // Stopping progress if out of materials
            if (items['Raw'][material] <= 1) {
                setProgress('');
                dispatch(push(`You ran out of Raw ${material}.~`));
            }
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

    useEffect(() => {
        let req = expTable[material].req;
        let brn = expTable[material].burn;
        let rate = (character[skill].level - req) / (brn - req);
        if (rate >= 1 ) {
            setBurn(100);
        } else {
            setBurn(Math.round(rate * 4000) / 100 + 60);
        }
    }, [material, character[skill]]);

    // Setting time for progress bar to fill
    const cook = type => {
        if (items['Raw'][type] >= 1) {
            setProgress(type)
        } else {
            dispatch(push(`Not enough Raw ${type}.~`));
        }
        setTiming(1);
    }

    const handleMaterial = event => {
        setProgress('');
        setMaterial(event.value);
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
                <small>{`Raw ${material}: ${items['Raw'] ? items['Raw'][material] ? items['Raw'][material] : 0 : 0}`}</small>
            </div>

            <div className={styles.row}>
                <div className='craft-container'>
                    <div>
                        <Select
                            placeholder={materialOptions[0]}
                            defaultValue={materialOptions[0]}
                            onChange={handleMaterial}
                            options={materialOptions.map(data => ({ value: data, label: data }))}
                            className='basic-multi-select'
                            classNamePrefix='select'
                        />
                        <small>{`Burn Rate: ${Math.round((100 - burn) * 100) / 100} %`}</small>
                    </div>
                    <div className='tree'>
                        <small>{material ? `Raw ${material}` : "No Items"}</small>
                        
                        <small>{`xp: ${expTable[material].exp}`}</small>
                        {
                            lvl >= expTable[material].req
                                ? <button onClick={() => cook(material)} className={styles.button} id='tree'>Cook</button>
                                : <small style={{ color: 'lightslategray', marginTop: '25px', marginBottom: '25px' }}>{`Required: ${expTable[material].req}`}</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}