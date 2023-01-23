import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { saveState, loadState } from './localStorage';
import { Woodcutting } from './features/skills/Woodcutting';
import { Mining } from './features/skills/Mining';
import { Smithing } from './features/skills/Smithing';
import { Skills } from './features/skills/Skills';
import { push } from './features/utils/consoleSlice';
import Bank from './components/Bank';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const [screen, setScreen] = useState('woodcut');
  const [backpack, setBackpack] = useState([]);

  const logs = useSelector(state => state.woodcut)
  const character = useSelector(state => state.character)
  const con = useSelector(state => state.console.console)

  const saveGame = () => {
    window.localStorage.setItem('Screen', JSON.stringify(screen));
    store.subscribe(() => {
      saveState({
        character: store.getState().character,
        bank: store.getState().bank,
        woodcut: store.getState().woodcut
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

  const components = {
    'bank': Bank,
    'woodcut': Woodcutting,
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
          <button onClick={() => setScreen('woodcut')}>{`Woodcutting (${character.Woodcutting.level})`}</button>
          <button onClick={() => setScreen('mining')}>{`Mining (${character.Mining.level})`}</button>
          <button onClick={() => setScreen('smithing')}>{`Smithing (${character.Smithing.level})`}</button>

        </div>
        <div className="App">
          <div className='pbars'>

            {screen === 'bank'
              ? <Bank
                backpack={backpack}
              />
              : <Display />
            }

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