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
                        now={Math.max(15, ((character.Woodcutting.experience - character.Woodcutting.last) * 100) / (character.Woodcutting.next - character.Woodcutting.last))}
                        label={`${Math.round(100 * (character.Woodcutting.experience - character.Woodcutting.last) / (character.Woodcutting.next - character.Woodcutting.last))}`} 
                        variant='success'
                        className='progress-bar-skill'
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Woodworking: ${character.Woodworking.level}`}</p>
                    <ProgressBar
                        now={Math.max(15, ((character.Woodworking.experience - character.Woodworking.last) * 100) / (character.Woodworking.next - character.Woodworking.last))}
                        label={`${Math.round(100 * (character.Woodworking.experience - character.Woodworking.last) / (character.Woodworking.next - character.Woodworking.last))}`} 
                        variant='success'
                        className='progress-bar-skill'
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Mining: ${character.Mining.level}`}</p>
                    <ProgressBar
                        now={Math.max(15, ((character.Mining.experience - character.Mining.last) * 100) / (character.Mining.next - character.Mining.last))}
                        label={`${Math.round(100 * (character.Mining.experience - character.Mining.last) / (character.Mining.next - character.Mining.last))}`} 
                        variant='success'
                        className='progress-bar-skill'
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Smithing: ${character.Smithing.level}`}</p>
                    <ProgressBar
                        now={Math.max(15, ((character.Smithing.experience - character.Smithing.last) * 100) / (character.Smithing.next - character.Smithing.last))}
                        label={`${Math.round(100 * (character.Smithing.experience - character.Smithing.last) / (character.Smithing.next - character.Smithing.last))}`} 
                        variant='success'
                        className='progress-bar-skill'
                    />
                </div>

                <div className='skill'>
                    <p className='sm'>{`Artifice: ${character.Artifice.level}`}</p>
                    <ProgressBar
                        now={Math.max(15, ((character.Artifice.experience - character.Artifice.last) * 100) / (character.Artifice.next - character.Artifice.last))}
                        label={`${Math.round(100 * (character.Artifice.experience - character.Artifice.last) / (character.Artifice.next - character.Artifice.last))}`} 
                        variant='success'
                        className='progress-bar-skill'
                    />
                </div>
            </div>
        </>
    )
}