import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from './Progress';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { push } from '../slices/consoleSlice';
import multipliers from '../json/Multipliers.json';
import enemies from '../json/Enemies.json';
import '../../App.css';
import styles from '../skills/Counter.module.css';

const BattleArea = ({ area, index }) => {
    const dispatch = useDispatch();
    const character = useSelector(state => state.character);
    const equipment = useSelector(state => state.equipment);

    // Stat initialization
    const [enemy, setEnemy] = useState([]);
    const [hp, setHp] = useState(1);
    const [attack, setAttack] = useState(character.Attack.level);
    const [defense, setDefense] = useState(character.Defense.level);
    const [strength, setStrength] = useState(character.Strength.level);
    const [gearAtk, setGearAtk] = useState();
    const [gearDef, setGearDef] = useState();
    const [gearStr, setGearStr] = useState();
    const [maxHit, setMaxHit] = useState();
    const [accuracy, setAccuracy] = useState();
    const [evasion, setEvasion] = useState();

    // Bars
    const [fighting, setFighting] = useState(false);
    const [bar1, setBar1] = useState(0);
    const [bar2, setBar2] = useState(0);

    const progressTimer = useRef();
    const enemyTimer = useRef();

    //console.log(character)
    //console.log(equipment)

    const calculateBonus = () => {
        var atk = 0, def = 0, str = 0;
        for (let i = 0; i < Object.keys(equipment).length - 1; i++) {
            var slot = equipment[Object.keys(equipment)[i]];
            atk += slot.Atk;
            def += slot.Def;
            str += slot.Str;
        }
        setGearAtk(atk);
        setGearDef(def);
        setGearStr(str);
    };

    useEffect(() => {
        calculateBonus();
    }, [])

    // Calculating max hit
    useEffect(() => {
        var effectiveStr = strength + 8;
        var max = Math.floor((effectiveStr * (gearStr + 64) + 320) / 64);
        console.log(max)
        setMaxHit(max);
    }, [strength, gearStr]);

    // Calculating accuracy
    useEffect(() => {
        var effectiveAtk = attack + 8;
        var acc = Math.floor(effectiveAtk * (gearAtk + 64));
        console.log(acc)
        setAccuracy(acc);
    }, [attack, gearAtk]);

    useEffect(() => {
        var effectiveDef = defense + 8;
        var def = Math.floor(effectiveDef * (gearDef + 64));
        console.log(def)
        setEvasion(def);
    }, [defense, gearDef]);

    // Setting monster stats
    useEffect(() => {
        setFighting(false);
        setEnemy([Object.values(area[index])[0][0], Object.values(area[index])[0][1], Object.values(area[index])[0][2]]);
        setHp(Object.values(area[index])[0][0]);
        setBar1(0);
        setBar2(0);
    }, [index]);

    // Handling intervals with progress bar
    useEffect(() => {
        if (fighting === true) {
            progressTimer.current = setInterval(handlePlayerTime, 100);
            return () => clearInterval(progressTimer.current)
        }
    }, [fighting]);

    useEffect(() => {
        if (fighting === true) {
            enemyTimer.current = setInterval(handleEnemyTime, 100);
            return () => clearInterval(enemyTimer.current)
        }
    }, [fighting]);

    // Handling damage when bar fills
    useEffect(() => {
        if (bar1 >= 100) {
            setBar1(0);
            setHp(n => n - 30);
        }

        if (bar2 >= 100) {
            setBar2(0);
        }
    }, [bar1, bar2]);

    // Handling monster death
    useEffect(() => {
        if (hp <= 0) {
            dispatch(push(`${Object.keys(area[index])} defeated!~`));
            setHp(enemy[0]);
            setBar1(0);
            setBar2(0);
        }
    }, [hp])

    const handlePlayerTime = () => {
        setBar1(n => n + (100 / 25));
    }

    const handleEnemyTime = () => {
        setBar2(e => e + (100 / 20));
    }

    const handleBattle = () => {
        setFighting(!fighting);
    }

    return (
        <div className='battle-area'>
            <p>{`Zone 1-${index + 1}`}</p>
            <div className='battle-screen'>
                <div className='left'>
                    <div className='hp-bars'>
                    <p>Me</p>
                    <ProgressBar
                        now={80}
                        variant='success'
                        className='battle-pbar'
                    />
                    <ProgressBar
                        now={bar1}
                        label={`${Math.round(250 - 250 * (bar1 / 100)) / 100}s`}
                    />
                        <p>100 / 100</p>
                        </div>
                    <div className='stat-box' style={{ border: '1px solid darkgreen' }}>
                        <small style={{ color: 'lightslategray', width: '100%' }}>Ratings</small>
                        <div className='stat-line'>
                            <small>Attack:</small>
                            <small>Defense:</small>
                            <small>Max Hit:</small>
                        </div>
                        <div className='stat-line'>
                            <small>{accuracy}</small>
                            <small>{evasion}</small>
                            <small>{maxHit}</small>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='hp-bars'>
                    <p>{Object.keys(area[index])}</p>

                    <ProgressBar
                        now={(hp / enemy[0]) * 100}
                        variant='danger'
                        className='battle-pbar'
                    />
                    <ProgressBar
                        now={bar2}
                        label={`${Math.round(200 - 200 * (bar2 / 100)) / 100}s`}
                    />
                        <p>{`${hp} / ${enemy[0]}`}</p>
                        </div>
                    <div className='stat-box' style={{ border: '1px solid darkred'}}>
                    <small style={{ color: 'lightslategray', width: '100%' }}>Ratings</small>
                        <div className='stat-line'>
                            <small>Attack:</small>
                            <small>Defense:</small>
                            <small>Max Hit:</small>
                        </div>
                        <div className='stat-line'>
                            <small>{accuracy}</small>
                            <small>{evasion}</small>
                            <small>{maxHit}</small>
                        </div>
                    </div>
                </div>
            </div>
            {!fighting
                ? <button onClick={handleBattle} className={styles.button} style={{ boxShadow: '5px 6px 0.5em #000'}}>Battle</button>
                : <button onClick={handleBattle} className={styles.button}>Stop</button>
            }
        </div>
    )
}

const Adventure = () => {
    const [areas] = useState([
        { 'Goblin': [50, 5, 5] },
        { 'Wolf': [80, 10, 5] },
        { 'Orc': [120, 20, 10] },
        { 'Warg': [150, 35, 5] },
        { 'Troll': [250, 25, 25] }
    ]);
    //const [areas] = useState(Object.keys(enemies))
    const [current, setCurrent] = useState(0);
    //const [currentArea, setCurrentArea] = useState('Farm');

    console.log(enemies)

    const changeArea = level => {
        setCurrent(level);
    }

    return (
        <div>
            <h2>Adventure</h2>
            <div className='container'>
                {/* <select>
                    {areas.map((d, i) => <option key={i} value={d} onChange={e => changeArea(e)}>{d}</option>)}
                </select>
                    <p style={{ color: 'white' }}>{currentArea}</p> */}
                {areas.map((data, index) => (
                    <div key={index}>
                        <button onClick={() => changeArea(index)}>{`Area 1-${index + 1}`}</button>
                    </div>
                ))}
            </div>
            <BattleArea
                index={current}
                area={areas}
            />
        </div>
    )
}

export default Adventure;