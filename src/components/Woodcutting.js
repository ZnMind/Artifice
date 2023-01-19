import React, { useState, useEffect, useRef } from 'react';
import Bank from '../json/bank.json';
import Character from '../json/character.json';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../App.css';

const Progress = props => {
    return <ProgressBar now={props.progress} label={`${props.type}: ${(100 - props.progress) / 20}s`} />;
}

const Level = props => {
    return <ProgressBar now={(props.progress / props.next) * 100} label={`${props.progress} / ${props.next}`} />
}

const Woodcutting = () => {
    const [action, setAction] = useState('none');
    const [tree, setTree] = useState('none');
    const [progress, setProgress] = useState(0);
    const [inventory, setInventory] = useState(Bank);
    const [backpack, setBackpack] = useState([]);
    const [character, setCharacter] = useState(Character)

    const progressTimer = useRef();

    const handleTime = () => {
        setProgress(prev => prev + 2);
    }

    const woodcut = type => {
        switch (type) {
            case 'Normal':
                Bank.wood.normal += 1;
                Character.woodcutting.experience += 10;
                console.log(Character.woodcutting.experience);
                break;
            case 'Oak':
                Bank.wood.oak += 1;
                Character.woodcutting.experience += 25;
                console.log(Character.woodcutting.experience);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (progress >= 100) {
            woodcut(tree);

            if (Character.woodcutting.experience >= Character.woodcutting.next) {
                Character.woodcutting.level += 1;
                Character.woodcutting.next += 100;
                console.log('level up!')
                console.log('level: ' + Character.woodcutting.level);
            }
            console.log(Bank.wood.normal)
            setProgress(0);
            //clearInterval(progressTimer.current);
        }
    }, [progress, tree]);

    useEffect(() => {
        setBackpack([inventory]);
    }, [inventory]);

    useEffect(() => {
        setProgress(0);
        if (action !== 'none') {
            progressTimer.current = setInterval(handleTime, 100);

            return () => clearInterval(progressTimer.current)
        }
    }, [action, tree])

    const chopTree = type => {
        //clearInterval(progressTimer.current)
        setAction('woodcutting');
        setTree(type);
        console.log(Bank);
    }

    return (
        <div>
            <Level 
                progress={Character.woodcutting.experience}
                next={Character.woodcutting.next}
            />
            <Progress
                progress={progress}
                type={tree}
            />
            <div className='container'>
                <div className='tree'>
                    Normal
                    <button onClick={() => chopTree('Normal')} id='tree'>Chop</button>
                </div>
                <div className='tree'>
                    Oak
                    <button onClick={() => chopTree('Oak')} id='tree'>Chop</button>
                </div>
            </div>
        </div>
    )
}

export default Woodcutting;