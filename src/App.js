import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { saveState } from './localStorage';
import { Woodcut } from './features/skills/Woodcut';
import { Skills } from './features/utils/Skills';
import { push } from './features/utils/consoleSlice';
import BankScreen from './components/Bank';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const [screen, setScreen] = useState('woodcut');
  const [backpack, setBackpack] = useState([]);

  const logs = useSelector(state => state.woodcut)
  const char = useSelector(state => state.character)
  const con = useSelector(state => state.console.console)

const saveGame = () => {
  //window.localStorage.setItem('Character', JSON.stringify(char));
  store.subscribe(() => {
    saveState({
      character: store.getState().character,
      woodcut: store.getState().woodcut
    });
  });
  dispatch(push(`Game Saved!~`))
}

useEffect(() => {
  const data = window.localStorage.getItem('Character');
  if (data !== null ) {
    console.log(JSON.parse(data))
  };
}, [])

  return (
    <>
    <div className='app-container'>
      <div className='navigate'>
        <button onClick={() => setScreen('bank')}>Bank</button>
        <button onClick={() => setScreen('woodcutting')}>{`Woodcutting (${char.woodcutting.level})`}</button>

      </div>
      <div className="App">
        <h2>Pbars</h2>
        <div className='pbars'>
          
          {screen === 'bank'
            ? <BankScreen
              backpack={backpack}
            />
            : <Woodcut />
          }

          <p>{`Normal logs: ${logs.normal}`}</p>
          <p>{`Oak logs: ${logs.oak}`}</p>
          <p>{`Willow logs: ${logs.willow}`}</p>
          
        </div>
        <button onClick={saveGame}>Save</button>
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
    </div>
    </>
  );
}

export default App;