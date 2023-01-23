import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from 'react-redux';

export const Skills = () => {
    const character = useSelector(state => state.character);

    return (
        <>
            <div className='skill-container'>
                <div className='skill'>
                    <p className='sm'>{`Woodcutting: ${character.Woodcutting.level}`}</p>

                    <ProgressBar
                        now={((character.Woodcutting.experience - character.Woodcutting.last) * 100) / (character.Woodcutting.next - character.Woodcutting.last)}
                        label={`${character.Woodcutting.experience}`} variant='success'
                        className='progress-bar-skill'
                        
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Mining: ${character.Mining.level}`}</p>
                    <ProgressBar
                        now={((character.Mining.experience - character.Mining.last) * 100) / (character.Mining.next - character.Mining.last)}
                        label={`${character.Mining.experience}`}
                        variant='success'
                        className='progress-bar-skill'
                        
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Smithing: ${character.Smithing.level}`}</p>
                    <ProgressBar
                        now={((character.Smithing.experience - character.Smithing.last) * 100) / (character.Smithing.next - character.Smithing.last)}
                        label={`${character.Smithing.experience}`}
                        variant='success'
                        className='progress-bar-skill'

                    />
                </div>

                {/* <div className='row'>{`Woodcutting: ${character.woodcutting.level}`}</div>
                <ProgressBar
                    now={((character.woodcutting.experience - character.woodcutting.last) * 100) / (character.woodcutting.next - character.woodcutting.last)}
                    label={`${character.woodcutting.experience}`} variant='success'
                    className='progress-bar-skill'
                /> */}

                {/* <div className='row'>{`Mining: ${character.mining.level}`}</div>
            <ProgressBar
                now={((character.mining.experience - character.mining.last) * 100) / (character.mining.next - character.mining.last)}
                label={`${character.mining.experience}`} variant='success'
                className='progress-bar-skill'
                /> */}
            </div>






            {/* 
                character.mining !== undefined
                    ? <><div>{character.mining.level}</div>
                        <ProgressBar
                            now={((character.woodcutting.experience - character.woodcutting.last) * 100) / (character.woodcutting.next - character.woodcutting.last)}
                            label={`${character.woodcutting.experience}`} variant='success' className='progress-bar-skill'
                        /></>
                    : <><div>1</div><ProgressBar now={0} className='progress-bar-skill' /></>
             */}
        </>


    )
}