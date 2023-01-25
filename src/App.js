import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { saveState, loadState } from './localStorage';
import { Woodcutting } from './features/skills/Woodcutting';
import { Mining } from './features/skills/Mining';
import { Smithing } from './features/skills/Smithing';
import { Skills } from './features/skills/Skills';
import { push } from './features/slices/consoleSlice';
import Bank from './features/components/Bank';
import Equipment from './features/components/Equipment';
import Adventure from './features/components/Adventure';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const [screen, setScreen] = useState('woodcutting');

  const logs = useSelector(state => state.woodcut)
  const character = useSelector(state => state.character)
  const con = useSelector(state => state.console.console)

  const saveGame = () => {
    //window.localStorage.setItem('Screen', JSON.stringify(screen));
    store.subscribe(() => {
      saveState({
        character: store.getState().character,
        bank: store.getState().bank,
      });
    });
    dispatch(push(`Game Saved!~`))
  }

  useEffect(() => {
    const data = window.localStorage.getItem('Screen');
    if (data !== null) {
      setScreen(JSON.parse(data));
    };
  }, [])

  useEffect(() => {
    //setDisplay(components[screen]);
  }, []);

  const components = {
    'bank': Bank,
    'equipment': Equipment,
    'adventure': Adventure,
    'woodcutting': Woodcutting,
    'mining': Mining,
    'smithing': Smithing,
  }

  const Display = components[screen]

  return (
    <>
    <div className='header'><h2>Artifice</h2></div>
      <div className='app-container'>
        <div className='navigate'>
          <button onClick={() => setScreen('bank')}>Bank</button>
          <button onClick={() => setScreen('equipment')}>Equipment</button>
          <button onClick={() => setScreen('adventure')} className='space'>Adventure</button>

          <button onClick={() => setScreen('woodcutting')}>{`Woodcutting (${character.Woodcutting.level})`}</button>
          <button onClick={() => setScreen('mining')}>{`Mining (${character.Mining.level})`}</button>
          <button onClick={() => setScreen('smithing')}>{`Smithing (${character.Smithing.level})`}</button>

        </div>
        <div className="App">
          <div>
            <Display />
          </div>
        </div>
        <div className='skill-screen'>
          <Skills />
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