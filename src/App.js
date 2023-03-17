import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './app/store';
import { saveState } from './localStorage';
import { Woodcutting } from './features/skills/Woodcutting';
import { Woodworking } from './features/skills/Woodworking';
import { Mining } from './features/skills/Mining';
import { Smithing } from './features/skills/Smithing';
import { Crafting } from './features/skills/Crafting';
import { Artifice } from './features/skills/Artifice';
import { Cooking } from './features/skills/Cooking';
import { Skills } from './features/skills/Skills';
import { ModScreen } from './features/skills/Skills';
import { About, Changes } from './features/components/About';
import { Tutorial } from './features/components/Tutorial';
import ErrorBoundary from './features/components/Error';
import { push } from './features/slices/consoleSlice';
import { currentStyle } from './features/slices/combatSlice';
import Bank from './features/components/Bank';
import Equipment from './features/components/Equipment';
import Adventure from './features/components/Adventure';
import './App.css';

import analytics from './features/components/Analytics';

//const Bank = React.lazy(() => import('./features/components/Bank'));
//const Equipment = React.lazy(() => import('./features/components/Equipment'));

const App = () => {
  const dispatch = useDispatch();
  const saveTimer = useRef();
  const [screen, setScreen] = useState('bank');
  const [mod, setMod] = useState('skills');
  const [stats, setStats] = useState();
  const [changes, setChanges] = useState(false);
  const [about, setAbout] = useState(false);
  const [tutorial, setTutorial] = useState(true);
  const [gaState, setGaState] = useState({});

  const character = useSelector(state => state.character);
  const equipment = useSelector(state => state.equipment);
  const style = useSelector(state => state.combat.Style);
  const con = useSelector(state => state.console.console);

  // Google Analytics
  const handleAnalytics = () => {
    try {
      analytics.page();
      const state = analytics.getState();

      if (analytics.user('anonymousId')) {
        const userId = analytics.user('anonymousId').split("-")[0];
        if (!analytics.user('userId')) {
          analytics.identify(userId);
        }
      }

      setGaState(state);
      return state;
    } catch (err) {
      console.log("Something went wrong with ga :(", err);
    }
  }

  const saveGame = () => {
    analytics.page();
    window.localStorage.setItem('Screen', JSON.stringify(screen));
    store.subscribe(() => {
      saveState({
        bank: store.getState().bank,
        character: store.getState().character,
        combat: store.getState().combat,
        equipment: store.getState().equipment,
      });
    });
    dispatch(push(`Game Saved!~`))

    try {
      if (gaState.user) {
        analytics.track('gameSaved', {
          userId: gaState.user.userId
        });
      } else {
        let context = handleAnalytics();
        analytics.track('gameSaved', {
          userId: context.user.userId
        });
      }
    } catch (err) {
      console.log("Something went wrong with ga :(", err);
    }
  };

  const handleStyles = event => {
    dispatch(currentStyle(event.target.innerText));
  }

  const handleTutorial = () => {
    setTutorial(!tutorial);
    window.localStorage.setItem('Tutorial', JSON.stringify(!tutorial));
  }

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

  const handleScreen = (tab) => {
    if (tab === 'bank') {
      document.getElementById("bank-tab").style.zIndex = 300;
    } else {
      document.getElementById("bank-tab").style.zIndex = 100;
    }
    /* let selectedTab = document.getElementById(`${tab}-tab`);
    let otherTab = document.getElementById(`${screen}-tab`);
    console.log(tab);
    console.log(selectedTab)
    selectedTab.style.zIndex = 300;
    otherTab.style.zIndex = 100; */

    setScreen(tab);
  };

  useEffect(() => {
    handleAnalytics();
    calculateBonus();

    let data = window.localStorage.getItem('Screen');
    let status = window.localStorage.getItem('Tutorial');
    if (data !== null) {
      setScreen(JSON.parse(data));
    };
    if (status !== null) {
      setTutorial(JSON.parse(status));
    };
    saveTimer.current = setInterval(saveGame, 60000);
    return () => clearInterval(saveTimer.current);
  }, []);

  useEffect(() => {
    try {
      analytics.page();
      if (gaState.user) {
        analytics.track('changeScreen', {
          userId: gaState.user.userId,
          screen: screen
        })
      } else {
        let context = handleAnalytics();
        analytics.track('changeScreen', {
          userId: context.user.userId,
          screen: screen
        })
      }
    } catch (err) {
      console.log("Something went wrong with ga :(", err);
    }
  }, [screen, gaState.user]);

  const components = {
    'bank': Equipment,
    'equipment': Equipment,
    'adventure': Adventure,
    'woodcutting': Woodcutting,
    'woodworking': Woodworking,
    'mining': Mining,
    'smithing': Smithing,
    'crafting': Crafting,
    'cooking': Cooking,
    'artifice': Artifice,
  }

  const modifiers = {
    'skills': Skills,
    'modifiers': ModScreen
  }

  let Display = components[screen]
  const ModDisplay = modifiers[mod]

  return (
    <>
      <div className='header'><h2>Artifice</h2></div>
      <ErrorBoundary>
        {about ?
          <About
            onClose={() => setAbout(!about)}
            onOpen={() => setTutorial(!tutorial)}
          />
          : ""}
        {changes ?
          <Changes
            onClose={() => setChanges(!changes)}
          />
          : ""}
        {tutorial ?
          <Tutorial
            status={handleTutorial}
          />
          : ""}
      </ErrorBoundary>
      <div className='app-container'>
        <div className='navigate'>
          <div className='character'>
            {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1em' }}>
              <div className='face'>
                <div className='eyeline'>
                  <div className='eye'></div>
                  <div className='eye'></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className='mouth'></div>
                </div>
              </div>
            </div> */}
            {['Attack', 'Strength', 'Defense'].map((data, index) => (
              data === style
                ? <div key={index} className='div-button' onClick={handleStyles} style={{ backgroundColor: 'lightgray' }}>{data}</div>
                : <div key={index} className='div-button' onClick={handleStyles}>{data}</div>
            ))}
            <small>{`Training Style: `}<b>{style}</b></small>
          </div>
          <div className='div-button' onClick={() => handleScreen('bank')}>Bank</div>
          <div className='div-button' onClick={() => handleScreen('equipment')}>Equipment</div>
          <div className='div-button space' onClick={() => handleScreen('adventure')}>Adventure</div>

          {/* {Object.keys(components).map((data, index) =>(
            <div className='div-button' onClick={() => handleScreen('woodcutting')}>{`${data} (${character.Woodcutting.level})`}</div>
          ))} */}
          <div className='div-button' onClick={() => handleScreen('woodcutting')}>{`Woodcutting (${character.Woodcutting.level})`}</div>
          <div className='div-button' onClick={() => handleScreen('woodworking')}>{`Woodworking (${character.Woodworking.level})`}</div>
          <div className='div-button' onClick={() => handleScreen('mining')}>{`Mining (${character.Mining.level})`}</div>
          <div className='div-button' onClick={() => handleScreen('smithing')}>{`Smithing (${character.Smithing.level})`}</div>
          <div className='div-button' onClick={() => handleScreen('crafting')}>{`Crafting (${character.Crafting.level})`}</div>
          <div className='div-button' onClick={() => handleScreen('cooking')}>{`Cooking (${character.Cooking.level})`}</div>
          <div className='div-button space' onClick={() => handleScreen('artifice')}>{`Artifice (${character.Artifice.level})`}</div>

          <div className='div-button' onClick={() => setChanges(!changes)}>{`Changelog`}</div>
          <div className='div-button' onClick={() => setAbout(!about)}>{`About`}</div>

        </div>
        <div className="App">
          <ErrorBoundary>
            <Bank />
            <div className='background'>
              {/* <Woodcutting />
              <Woodworking /> */}
              <Display />
            </div>
          </ErrorBoundary>
        </div>
        <div className='skill-screen'>
          <div className='buffs'>
            <div className='buff-btn' style={{ borderRight: '1px solid black' }} onClick={() => setMod('skills')}>Skills</div>
            <div className='buff-btn' onClick={() => setMod('modifiers')}>Modifiers</div>
          </div>
          <ErrorBoundary>
            <ModDisplay />
          </ErrorBoundary>
        </div>
      </div>
      <div className='console'>
        <div className='console-box'>
          {con.split("~").reverse().map((data, index) => (
            <div key={index}>{data}</div>
          ))}
        </div>
        <button
          onClick={() => {
            saveGame()
          }}
          className='save'>Save</button>
        <small className='save'>Autosave every 60s</small>
      </div>
    </>
  );
}

export default App;