import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from 'react-redux';

export const Skills = () => {
    const character = useSelector(state => state.character);

    return (
            <div className='skill-container'>

                {Object.keys(character).map((data, index) => (
                    <div key={index} className='skill'>
                        <p className='sm'>{`${data}: ${character[data].level}`}</p>
                        <ProgressBar
                            now={Math.max(15, ((character[data].experience - character[data].last) * 100) / (character[data].next - character[data].last))}
                            label={`${Math.round(100 * (character[data].experience - character[data].last) / (character[data].next - character[data].last))}`}
                            variant='success'
                            className='progress-bar-skill'
                        />
                    </div>
                ))}

            </div>
    )
}

export const ModScreen = () => {
    const lvl = useSelector(state => state.character);
    const bonus = useSelector(state => state.equipment.Bonus);

    var wc = Math.round((bonus.Axe / 2 + 100 + ((lvl.Woodcutting.level - 1) / 2) * (1 + bonus.Axe / 100)) * 100) / 100;
    var mining = Math.round((bonus.Pick / 2 + 100 + ((lvl.Mining.level - 1) / 2) * (1 + bonus.Pick / 100)) * 100) / 100;
    var fishing = Math.round((bonus.Rod / 2 + 100 + ((lvl.Fishing.level - 1) / 2) * (1 + bonus.Rod / 100)) * 100) / 100;

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '1em', color: 'lightslategray' }}>Speed Bonus</div>
            <div className='mod-box'>
                <div className='mod-line'>
                    <p>Woodcutting:</p>
                    <p>Mining:</p>
                    <p>Fishing:</p>
                </div>
                <div className='mod-line'>
                    <p>{`${wc} %`}</p>
                    <p>{`${mining} %`}</p>
                    <p>{`${fishing} %`}</p>
                </div>
            </div>
        </div>
    )
}