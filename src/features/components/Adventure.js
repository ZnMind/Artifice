import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from './Progress';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { push } from '../slices/consoleSlice';
import multipliers from '../json/Multipliers.json';
import '../../App.css';
import styles from '../skills/Counter.module.css';

const BattleArea = ({ area, index }) => {
    const dispatch = useDispatch();
    const [enemy, setEnemy] = useState([]);
    const [hp, setHp] = useState(1)
    const [fighting, setFighting] = useState(false);
    const [bar1, setBar1] = useState(0);
    const [bar2, setBar2] = useState(0);

    const progressTimer = useRef();
    const enemyTimer = useRef();

    console.log(area)
    console.log(Object.values(area[index]))
    console.log(index);

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
                    <div className='stat-box'>
                        <small>80 / 100</small>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                        <small>Accuracy: 5</small>
                        <small>Evasion: 0</small>
                        </div>
                    </div>
                </div>
                <div className='right'>
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
                    <div className='stat-box'>
                        <small>{`${hp} / ${enemy[0]}`}</small>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <small>{`Accuracy: ${enemy[1]}`}</small>
                            <small>{`Evasion: ${enemy[2]}`}</small>
                        </div>
                    </div>
                </div>
            </div>
            {!fighting
                ? <button onClick={handleBattle} className={styles.button}>Battle</button>
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
    const [current, setCurrent] = useState(0);

    const changeArea = level => {
        setCurrent(level);
    }

    return (
        <div>
            <h2>Adventure</h2>
            <div className='container'>
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