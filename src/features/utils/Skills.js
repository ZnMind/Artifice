import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from 'react-redux';

export const Skills = () => {
    const char = useSelector(state => state.character);

    return (
        <>
        
            <div className='row'>Woodcutting: </div><div>{char.woodcutting.level}</div><ProgressBar now={((char.woodcutting.experience - char.woodcutting.last) * 100) / (char.woodcutting.next - char.woodcutting.last)} label={`${char.woodcutting.experience}`} variant='success' className='progress-bar-skill' />
            <div className='row'>Mining: </div><ProgressBar now={0} label={`Action:s`} className='progress-bar-skill' />
        </>


    )
}