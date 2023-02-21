import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { saveState, loadState } from './localStorage';
import { Woodcutting } from './features/skills/Woodcutting';
import { Mining } from './features/skills/Mining';
import { Smithing } from './features/skills/Smithing';
import { Artifice } from './features/skills/Artifice';
import { Skills } from './features/skills/Skills';
import { ModScreen } from './features/skills/Skills';
import { push } from './features/slices/consoleSlice';
import { currentStyle } from './features/slices/combatSlice';
import Bank from './features/components/Bank';
import Equipment from './features/components/Equipment';
import Adventure from './features/components/Adventure';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const saveTimer = useRef();
  const [screen, setScreen] = useState('woodcutting');
  const [mod, setMod] = useState('skills');
  const [stats, setStats] = useState();

  const character = useSelector(state => state.character);
  const equipment = useSelector(state => state.equipment);
  const style = useSelector(state => state.combat.Style);
  const con = useSelector(state => state.console.console);

  const saveGame = () => {
    //window.localStorage.setItem('Screen', JSON.stringify(screen));
    store.subscribe(() => {
      saveState({
        bank: store.getState().bank,
        character: store.getState().character,
        equipment: store.getState().equipment,
      });
    });
    dispatch(push(`Game Saved!~`))
  }

  const handleStyles = event => {
    dispatch(currentStyle(event.target.innerText));
  }

  useEffect(() => {
    const data = window.localStorage.getItem('Screen');
    if (data !== null) {
      setScreen(JSON.parse(data));
    };

    saveTimer.current = setTimeout(saveGame, 60000);
    return () => clearInterval(saveTimer.current);
  }, [])

  useEffect(() => {
    calculateBonus();
  }, []);

  const calculateBonus = () => {
    var atk = 0, def = 0, str = 0;
    for (let i = 0; i < Object.keys(equipment).length - 1; i++) {
      var slot = equipment[Object.keys(equipment)[i]];
      atk += slot.Atk;
      def += slot.Def;
      str += slot.Str;
    }
    setStats([atk, def, str])
  };

  const components = {
    'bank': Bank,
    'equipment': Equipment,
    'adventure': Adventure,
    'woodcutting': Woodcutting,
    'mining': Mining,
    'smithing': Smithing,
    'artifice': Artifice,
  }

  const modifiers = {
    'skills': Skills,
    'modifiers': ModScreen
  }

  const Display = components[screen]
  const ModDisplay = modifiers[mod]

  return (
    <>
      <div className='header'><h2>Artifice</h2></div>
      <div className='app-container'>
        <div className='navigate'>
          <div className='character'>
            <p>Me</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1em' }}>
              <div className='face'>
                <div className='eyeline'>
                  <div className='eye'></div>
                  <div className='eye'></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className='mouth'></div>
                </div>
              </div>
            </div>
            {/* <small>{`Bonuses:`}</small>
            <small>{stats[0]}</small>
            <small>{stats[1]}</small>
            <small>{stats[2]}</small> */}
            <small>{`Training Style: `}<b>{style}</b></small>
            {['Attack', 'Strength', 'Defense'].map((data, index) => (
              data === style
                ? <div key={index} className='div-button' onClick={handleStyles} style={{ backgroundColor: 'lightgray' }}>{data}</div>
                : <div key={index} className='div-button' onClick={handleStyles}>{data}</div>
            ))}
          </div>
          <div className='div-button' onClick={() => setScreen('bank')}>Bank</div>
          <div className='div-button' onClick={() => setScreen('equipment')}>Equipment</div>
          <div className='div-button space' onClick={() => setScreen('adventure')}>Adventure</div>

          <div className='div-button' onClick={() => setScreen('woodcutting')}>{`Woodcutting (${character.Woodcutting.level})`}</div>
          <div className='div-button' onClick={() => setScreen('mining')}>{`Mining (${character.Mining.level})`}</div>
          <div className='div-button' onClick={() => setScreen('smithing')}>{`Smithing (${character.Smithing.level})`}</div>
          <div className='div-button' onClick={() => setScreen('artifice')}>{`Artifice (${character.Artifice.level})`}</div>

        </div>
        <div className="App">
          <div>
            <Display />
          </div>
        </div>
        <div className='skill-screen'>
          <div className='buffs'>
            <div className='buff-btn' style={{ borderRight: '1px solid black' }} onClick={() => setMod('skills')}>Skills</div>
            <div className='buff-btn' onClick={() => setMod('modifiers')}>Modifiers</div>
          </div>
          <ModDisplay />
        </div>
      </div>
      <div className='console'>
        <div className='console-box'>
          {con.split("~").map((data, index) => (
            <div key={index}>{data}</div>
          ))}
        </div>
        <button onClick={saveGame} className='save'>Save</button>
        <small className='save'>Autosave every 60s</small>
      </div>
    </>
  );
}

export default App;