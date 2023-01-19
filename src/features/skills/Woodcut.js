import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Progress } from '../utils/Progress';
import {
    incrementNormal,
    decrementNormal,
    incrementOak,
    incrementWillow,
    selectNormal
} from './woodcutSlice';
import {
    levelUp,
    gainExp,
    getLast,
    calcNext
} from '../utils/characterSlice';
import {
    push
} from '../utils/consoleSlice';
import styles from './Counter.module.css';

export function Woodcut() {
    const count = useSelector(selectNormal);
    const logs = useSelector(state => state.woodcut);
    const bar = useSelector(state => state.progress);
    const char = useSelector(state => state.character.woodcutting);
    var con = useSelector(state => state.console)
    const dispatch = useDispatch();
    const [incrementAmount, setIncrementAmount] = useState('2');
    const [action, setAction] = useState('Normal');
    const [timing, setTiming] = useState(0);

    const incrementValue = Number(incrementAmount) || 0;

    useEffect(() => {
        if (bar.now >= 100) {
            switch (action) {
                case 'Normal':
                    dispatch(incrementNormal())
                    dispatch(gainExp(25))
                    dispatch(push(`Chopped ${action} log! Amount: ${logs.normal + 1}~`))
                    break;
                case 'Oak':
                    dispatch(incrementOak())
                    dispatch(gainExp(40))
                    dispatch(push(`Chopped ${action} log! Amount: ${logs.oak + 1}~`))
                    break;
                case 'Willow':
                    dispatch(incrementWillow())
                    dispatch(gainExp(60))
                    dispatch(push(`Chopped ${action} log! Amount: ${logs.willow + 1}~`))
                    break;
                default:
                    break;
            }
        }
    }, [bar]);

    useEffect(() => {
        if (char.experience >= char.next) {
            dispatch(getLast());
            let nextLv = Math.round(100 * Math.pow(2, (char.level / 8)))
            dispatch(calcNext(nextLv));
            dispatch(levelUp());
            dispatch(push(`Congrats you leveled up! Woocutting ${char.level + 1}~`))
        }
    }, [char]);

    const chopTree = type => {
        setAction(type);
        switch (type) {
            case 'Normal':
                setTiming(2);
                break;
            case 'Oak':
                setTiming(1);
                break;
            case 'Willow':
                setTiming(0.5);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <Progress
                action={action}
                timing={timing}
            />
            <div className='exp'>
            <small>Level: {`${char.level}`}</small>
            <small>Exp: {`${char.experience} / ${char.next}`}</small>

            </div>
            <div className={styles.row}>
                <div className='container'>
                    <div className='tree'>
                        <p>Normal</p>
                        <small>5s</small>
                        <button onClick={() => chopTree('Normal')} className={styles.button} id='tree'>Chop</button>
                    </div>
                    <div className='tree'>
                        <p>Oak</p>
                        <small>10s</small>
                        {char.level >= 15
                            ? <button onClick={() => chopTree('Oak')} className={styles.button} id='tree'>Chop</button>
                            : <small>Required: 15</small>
                        }
                    </div>
                    <div className='tree'>
                        <p>Willow</p>
                        <small>15s</small>
                        {char.level >= 30
                            ? <button onClick={() => chopTree('Willow')} className={styles.button} id='tree'>Chop</button>
                            : <small>Required: 30</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}