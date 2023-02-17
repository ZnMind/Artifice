import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from './Progress';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { gainExp } from '../slices/characterSlice';
import { increment } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import { updateHp, resetHp } from '../slices/combatSlice';
import multipliers from '../json/Multipliers.json';
import enemies from '../json/Enemies.json';
import Select from 'react-select';
import '../../App.css';
import styles from '../skills/Counter.module.css';

const BattleArea = ({ zone, area }) => {
    const dispatch = useDispatch();
    const character = useSelector(state => state.character);
    const equipment = useSelector(state => state.equipment);
    const characterHp = useSelector(state => state.combat.Hp);

    // Stat initialization
    const [attack, setAttack] = useState(character.Attack.level);
    const [defense, setDefense] = useState(character.Defense.level);
    const [strength, setStrength] = useState(character.Strength.level);
    const [gearAtk, setGearAtk] = useState();
    const [gearDef, setGearDef] = useState();
    const [gearStr, setGearStr] = useState();
    const [maxHit, setMaxHit] = useState();
    const [accuracy, setAccuracy] = useState();
    const [evasion, setEvasion] = useState();
    const [hit, setHit] = useState(0);

    // Enemy stat initialization
    const [enemy, setEnemy] = useState();
    const [enemyHp, setEnemyHp] = useState();
    const [enemyAttack, setEnemyAttack] = useState();
    const [enemyDefense, setEnemyDefense] = useState();
    const [enemyStrength, setEnemyStrength] = useState();
    const [enemyHit, setEnemyHit] = useState(0);

    // Skill check
    const [skill] = useState('Strength');
    const [lvl, setLvl] = useState(character[skill] ? character[skill].level : 1);

    // Bars
    const [fighting, setFighting] = useState(false);
    const [bar1, setBar1] = useState(0);
    const [bar2, setBar2] = useState(0);

    const progressTimer = useRef();
    const enemyTimer = useRef();

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

    useEffect(() => {
        if (area) {
            setEnemy(enemies[zone][area])
            setFighting(false);
            setBar1(0);
            setBar2(0);
        }
    }, [area]);

    /* Player Stats */
    // Calculating max hit
    useEffect(() => {
        var effectiveStr = strength + 8;
        var max = Math.floor((effectiveStr * (gearStr + 64) + 320) / 64);
        setMaxHit(max);
    }, [strength, gearStr]);

    // Calculating accuracy
    useEffect(() => {
        var effectiveAtk = attack + 8;
        var acc = Math.floor(effectiveAtk * (gearAtk + 64));
        setAccuracy(acc);
    }, [attack, gearAtk]);

    // Calculating defense
    useEffect(() => {
        var effectiveDef = defense + 8;
        var def = Math.floor(effectiveDef * (gearDef + 64));
        setEvasion(def);
    }, [defense, gearDef]);

    // Chance to hit
    useEffect(() => {
        if (enemy) {
            if (accuracy > enemyDefense) {
                setHit(1 - (enemyDefense + 2) / (2 * (accuracy + 1)))
            } else {
                setHit(accuracy / (2 * (enemyDefense + 1)))
            }
        }
    }, [enemyDefense, accuracy]);

    /* Enemy Stats */
    useEffect(() => {
        if (enemy) {
            setEnemyHp(enemy.Hp);
            setEnemyAttack((enemy.Attack + 8) * 64);
            setEnemyDefense((enemy.Defense + 9) * 64);
            setEnemyStrength(((enemy.Strength + 8) * 64 + 320) / 64);
        }
    }, [enemy])

    useEffect(() => {
        if (enemyAttack > evasion) {
            setEnemyHit(1 - (evasion + 2) / (2 * (enemyAttack + 1)))
        } else {
            setEnemyHit(enemyAttack / (2 * (evasion + 1)))
        }
    }, [enemyAttack, evasion])

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
            var dmg = playerCombat();
            setEnemyHp(n => n - dmg);
        }

        if (bar2 >= 100) {
            setBar2(0);
            var dmg = enemyCombat();
            dispatch(updateHp(-dmg));
        }
    }, [bar1, bar2]);

    // Handling monster death
    useEffect(() => {
        if (characterHp.current <= 0) {
            setFighting(false);
            dispatch(push(`You died!~`));
            dispatch(resetHp());
            setEnemyHp(enemy.Hp);
            setBar1(0);
            setBar2(0);
        }

        if (enemyHp <= 0) {
            dispatch(push(`${area} defeated!~`));
            setEnemyHp(enemy.Hp);
            setBar1(0);
            setBar2(0);
            handleDrops();
        }
    }, [characterHp, enemyHp]);

    // Checking level up
    useEffect(() => {
        if (character[skill].level > lvl) {
            dispatch(push(`Congrats you leveled up! ${skill} level ${character[skill].level}~`))
            setLvl(lvl + 1);
        }
    }, [character[skill]]);

    const playerCombat = () => {
        var hitRoll = Math.random()
        if (hitRoll <= hit) {
            var dmg = Math.round(maxHit * Math.random());
            var styleExp = Math.ceil(dmg / 10) * 4;
            var hpExp = Math.round(styleExp / 3);
            dispatch(gainExp({ skill: 'Strength', amount: styleExp }));
            dispatch(gainExp({ skill: 'Hitpoints', amount: hpExp }));
            return dmg;
        } else {
            return 0;
        }
    };

    const enemyCombat = () => {
        var hitRoll = Math.random()
        if (hitRoll <= enemyHit) {
            return Math.round(enemyStrength * Math.random());
        } else {
            return 0;
        }
    };

    const handleDrops = () => {
        console.log("Drops");
        var dropList = enemies[zone][area].Drops;
        console.log(dropList)
        var keys = Object.keys(dropList);
        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
            if (dropList[keys[i]][0] === 1) {
                dispatch(push(`Dropped ${keys[i]} x${dropList[keys[i]][1]}~`));
                dispatch(increment({ material: keys[i].split(" ")[0], item: keys[i].split(" ")[1], amount: dropList[keys[i]][1] }));
            }
        }
    };

    const handlePlayerTime = () => {
        setBar1(n => n + (100 / 25));
    };

    const handleEnemyTime = () => {
        setBar2(e => e + (100 / 20));
    };

    const handleBattle = () => {
        setFighting(!fighting);
    };

    return (
        <div className='battle-area'>

            <div className='battle-screen'>
                <div className='left'>
                    <div className='hp-bars'>
                        <p>Me</p>
                        <ProgressBar
                            now={(characterHp.current / characterHp.max) * 100}
                            variant='success'
                            className='battle-pbar'
                        />
                        <ProgressBar
                            now={bar1}
                            label={`${Math.round(250 - 250 * (bar1 / 100)) / 100}s`}
                        />
                        <p>{`${characterHp.current} / ${characterHp.max}`}</p>
                    </div>
                    <div className='stat-box' style={{ border: '1px solid darkgreen' }}>
                        <small style={{ color: 'lightslategray', width: '100%', marginTop: '-1em' }}>Ratings</small>
                        <div className='stat-line'>
                            <small>Attack:</small>
                            <small>Defense:</small>
                            <small>Hit:</small>
                            <small>Max Hit:</small>
                        </div>
                        {accuracy ? <div className='stat-line'>
                            <small>{accuracy}</small>
                            <small>{evasion}</small>
                            <small>{`${Math.floor(hit * 1000) / 10}%`}</small>
                            <small>{maxHit}</small>
                        </div> : ""}
                    </div>
                </div>
                {area ? <div className='right'>

                    <div className='hp-bars'>
                        <p>{area ? area : ""}</p>

                        <ProgressBar
                            now={enemy ? (enemyHp / enemy.Hp) * 100 : 100}
                            variant='danger'
                            className='battle-pbar'
                        />
                        <ProgressBar
                            now={bar2}
                            label={`${Math.round(200 - 200 * (bar2 / 100)) / 100}s`}
                        />
                        <p>{enemy ? `${enemyHp} / ${enemy.Hp}` : 0}</p>
                    </div>
                    <div className='stat-box' style={{ border: '1px solid darkred' }}>
                        <small style={{ color: 'lightslategray', width: '100%', marginTop: '-1em' }}>Ratings</small>
                        <div className='stat-line'>
                            <small>Attack:</small>
                            <small>Defense:</small>
                            <small>Hit:</small>
                            <small>Max Hit:</small>
                        </div>
                        {enemy ? <div className='stat-line'>
                            <small>{enemyAttack}</small>
                            <small>{enemyDefense}</small>
                            <small>{`${Math.floor(enemyHit * 1000) / 10}%`}</small>
                            <small>{enemyStrength}</small>
                        </div> : ""}
                    </div>
                </div> : ""}
            </div>
            {area ? !fighting
                ? <button onClick={handleBattle} className={styles.button} style={{ boxShadow: '5px 6px 0.5em #000', marginTop: '0' }}>Battle</button>
                : <button onClick={handleBattle} className={styles.button} style={{ boxShadow: '5px 6px 0.5em #000', marginTop: '0' }}>Stop</button>
                : ""}
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
    const [zones] = useState(Object.keys(enemies));
    const [currentZone, setCurrentZone] = useState('');
    const [currentArea, setCurrentArea] = useState(currentZone[0])
    //const [areas] = useState(Object.keys(enemies))
    const [cb, setCb] = useState();
    //const [currentArea, setCurrentArea] = useState('Farm');

    useEffect(() => {
        if (currentZone !== "") {
            setCurrentArea(Object.keys(enemies[currentZone])[0])
        }
    }, [currentZone]);

    useEffect(() => {
        if (currentArea) {
            var mob = enemies[currentZone][currentArea];
            var lvl = ((mob.Defense + mob.Hp / 10) / 4) + ((13 / 40) * (mob.Attack + mob.Strength));
            setCb(Math.round(lvl));
        }
    }, [currentArea])

    return (
        <div>
            <h2>Adventure</h2>
            <div className='adventure-container'>

                <Select
                    placeholder={zones[0]}
                    defaultValue={zones[0]}
                    onChange={e => setCurrentZone(e.value)}
                    options={zones.map(data => ({ value: data, label: data }))}
                    className='basic-multi-select'
                    classNamePrefix='select'
                />

                {currentZone !== ""
                    ? <Select
                        placeholder={currentArea}
                        value={currentArea}
                        onChange={e => setCurrentArea(e.value)}
                        options={Object.keys(enemies[currentZone]).map(data => ({ value: data, label: data }))}
                        className='basic-multi-select'
                        classNamePrefix='select'
                    />
                    : ""
                }

                {/* <AreaSelect
                    data={Object.keys(enemies[currentZone])}
                /> */}

            </div>
            <BattleArea
                /* index={current}
                area={areas} */
                zone={currentZone}
                area={currentArea}
            />
        </div>
    )
}

const AreaSelect = props => {

    return (
        <Select

            onChange={e => console.log(e.value)}
            options={props.data.map(data => ({ value: data, label: data }))}
            className='basic-multi-select'
            classNamePrefix='select'
        />
    )
}

export default Adventure;