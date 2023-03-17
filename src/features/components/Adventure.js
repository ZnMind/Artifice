import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from './Progress';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { gainExp } from '../slices/characterSlice';
import { increment, decrement } from '../slices/bankSlice';
import { push } from '../slices/consoleSlice';
import { updateHp, updateMax, resetHp } from '../slices/combatSlice';
import multipliers from '../json/Multipliers.json';
import enemies from '../json/Enemies.json';
import Select from 'react-select';
import '../../App.css';
import styles from '../skills/Counter.module.css';

const BattleArea = ({ zone, area }) => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.bank);
    const character = useSelector(state => state.character);
    const equipment = useSelector(state => state.equipment);
    const characterHp = useSelector(state => state.combat.Hp);
    const style = useSelector(state => state.combat.Style);
    const [currentFood, setCurrentFood] = useState(items.Cooked ? Object.keys(items.Cooked)[0] : []);

    // Stat initialization
    const [attack, setAttack] = useState(character.Attack.level);
    const [defense, setDefense] = useState(character.Defense.level);
    const [strength, setStrength] = useState(character.Strength.level);
    const [gearAtk, setGearAtk] = useState();
    const [gearDef, setGearDef] = useState();
    const [gearStr, setGearStr] = useState();
    const [speed, setSpeed] = useState(20);
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
    const [skill] = useState(style);
    const [lvl, setLvl] = useState(character[style].level);
    const [hpLvl, setHpLvl] = useState(character['Hitpoints'].level);

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
        if (equipment['Weapon'].Name !== '') {
            setGearAtk(Math.round(atk * multipliers['Style'][equipment['Weapon'].Name.split(" ")[1].split("+")[0]][style]));
            let atkSpd = multipliers['Style'][equipment['Weapon'].Name.split(" ")[1].split("+")[0]]['Speed'];
            setSpeed(atkSpd * 10);
        } else {
            setGearAtk(atk)
        }
        setGearDef(def);
        setGearStr(str);
    };

    useEffect(() => {
        setLvl(character[style].level)
        calculateBonus();
    }, [style])

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
        let effectiveStr;
        if (style === 'Strength') {
            effectiveStr = strength + 11;
        } else {
            effectiveStr = strength + 8;
        }
        let max = Math.floor((effectiveStr * (gearStr + 64) + 320) / 64);
        setMaxHit(max);
    }, [strength, gearStr, style]);

    // Calculating accuracy
    useEffect(() => {
        let effectiveAtk;
        if (style === 'Attack') {
            effectiveAtk = attack + 11;
        } else {
            effectiveAtk = attack + 8;
        }
        let acc = Math.floor(effectiveAtk * (gearAtk + 64));
        setAccuracy(acc);
    }, [attack, gearAtk, style]);

    // Calculating defense
    useEffect(() => {
        let effectiveDef;
        if (style === 'Defense') {
            effectiveDef = defense + 11;
        } else {
            effectiveDef = defense + 8;
        }
        let def = Math.floor(effectiveDef * (gearDef + 64));
        setEvasion(def);
    }, [defense, gearDef, style]);

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
            setEnemyHp(enemyHp - dmg);
        }

        if (bar2 >= 100) {
            setBar2(0);
            var dmg = enemyCombat();
            dispatch(updateHp(-dmg));
        }
    }, [bar1, bar2]);

    // Handling death
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
        if (style === 'Attack') {
            if (character[style].level > attack) {
                dispatch(push(`Congrats you leveled up! ${style} level ${character[style].level}~`))
                setAttack(character[style].level);
            }
        } else if (style === 'Strength') {
            if (character[style].level > strength) {
                dispatch(push(`Congrats you leveled up! ${style} level ${character[style].level}~`))
                setStrength(character[style].level);
            }
        } else {
            if (character[style].level > defense) {
                dispatch(push(`Congrats you leveled up! ${style} level ${character[style].level}~`))
                setDefense(character[style].level);
            }
        }

        if (character['Hitpoints'].level > hpLvl) {
            dispatch(push(`Congrats you leveled up! Hp level ${character['Hitpoints'].level}~`));
            dispatch(updateMax(character['Hitpoints'].level * 10));
            dispatch(resetHp());
            setHpLvl(hpLvl + 1);
        }
    }, [character[style]]);

    const playerCombat = () => {
        var hitRoll = Math.random()
        if (hitRoll <= hit) {
            var dmg = Math.round(maxHit * Math.random());
            var styleExp = Math.ceil(dmg / 10) * 4;
            var hpExp = Math.round(styleExp / 3);
            dispatch(gainExp({ skill: style, amount: styleExp }));
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
        var dropList = enemies[zone][area].Drops;
        var keys = Object.keys(dropList);
        var rand = Math.random();
        var count = 0;

        for (let i = 0; i < keys.length; i++) {
            if (dropList[keys[i]][0] === 1) {
                dispatch(push(`Dropped ${keys[i]} x${dropList[keys[i]][1]}~`));
                dispatch(increment({ material: keys[i].split(" ")[0], item: keys[i].split(" ")[1], amount: dropList[keys[i]][1] }));
            } else {
                console.log(dropList[keys[i]][0])
                if (rand > count && rand <= count + dropList[keys[i]][0]) {
                    dispatch(push(`Dropped ${keys[i]} x${dropList[keys[i]][1]}~`));
                    dispatch(increment({ material: keys[i].split(" ")[0], item: keys[i].split(" ")[1], amount: dropList[keys[i]][1] }));
                    rand = 2;
                }
                count += dropList[keys[i]][0];
            }
        }
    };

    const handlePlayerTime = () => {
        setBar1(n => n + (100 / speed));
    };

    const handleEnemyTime = () => {
        setBar2(e => e + (100 / 20));
    };

    const handleBattle = () => {
        setFighting(!fighting);
    };

    const handleEat = () => {
        let heal = multipliers['Food'][currentFood];
        if (items['Cooked'][currentFood] >= 1) {
            if (heal >= characterHp.max - characterHp.current) {
                dispatch(resetHp());
            } else {
                dispatch(updateHp(heal));
            }
            dispatch(decrement({ material: 'Cooked', item: currentFood, amount: 1 }));
            dispatch(push(`Snacked on ${currentFood}!~`));
            setBar1(0);
        } else {
            dispatch(push(`You have no more ${currentFood}!~`))
        }
    }

    return (
        <>
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
                                label={`${Math.round(speed * 10 - speed * 10 * (bar1 / 100)) / 100}s`}
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
                {zone !== '' ?
                <div className='food'>
                    <Select
                        placeholder={Object.keys(items.Cooked)[0]}
                        defaultValue={Object.keys(items.Cooked)[0]}
                        onChange={e => setCurrentFood(e.value)}
                        options={Object.keys(items.Cooked).map(data => ({ value: data, label: `${data}` }))}
                        className='basic-multi-select'
                        classNamePrefix='select'
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>{`${currentFood}: +${multipliers['Food'][currentFood]}`}</small>
                        <small>{`Amount: ${items['Cooked'][currentFood]}`}</small>
                    </div>
                    <button className='equip-btn' onClick={handleEat} style={{ boxShadow: '2px 4px 0.5em #000', borderRadius: '5px'}}>Eat</button>
                </div> : ""}
                {area ? !fighting
                    ? <button onClick={handleBattle} className={styles.button} style={{ boxShadow: '5px 6px 0.5em #000', marginTop: '0', borderRadius: '5px' }}>Battle</button>
                    : <button onClick={handleBattle} className={styles.button} style={{ boxShadow: '5px 6px 0.5em #000', marginTop: '0', borderRadius: '5px' }}>Stop</button>
                    : ""}
            </div>
            
        </>
    )
}

const Adventure = () => {
    const [zones] = useState(Object.keys(enemies));
    const [currentZone, setCurrentZone] = useState('');
    const [currentArea, setCurrentArea] = useState(currentZone[0])
    const [cb, setCb] = useState();

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
        <div className='adventure'>
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

            </div>
            <BattleArea
                zone={currentZone}
                area={currentArea}
            />
        </div>
    )
}

export default Adventure;