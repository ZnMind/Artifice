import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../App.css';

// Adding mouseovers to each individual item
const Item = ({ data, index }) => {
  const [hover, setHover] = useState(false);

  const change = () => {
    setHover(!hover);
  }

  return (
    <div key={index} className='slot' onMouseEnter={change} onMouseLeave={change}>
      <p className='bank-text'>{`${data[0]} ${data[1]}`}</p>
      <p className='bank-text'>{data[2]}</p>
      {
        hover
          ? <div className='btn-div'><button className='equip-btn'>Sell</button><button className='equip-btn'>Equip</button></div>
          : ""
      }
    </div>
  )
}

const Bank = () => {
  const [inventory, setInventory] = useState([]);
  const [hover, setHover] = useState(false);
  const bank = useSelector(state => state.bank);

  // Converting state object into an array
  // Could probably be done cleaner but it works
  const objectToList = () => {
    return Object.keys(bank).map(key => {
      return Object.keys(bank[key]).map(k => {
        var temp = [key, k, bank[key][k]];
        return temp;
      })
    })
  }

  // Removing zero amounts from the array and setting inventory state
  useEffect(() => {
    var temp = objectToList();

    // Array.prototype.flatMap is a way to add or remove items during a map
    var noZeroes = temp.map((data) => {
      return data.flatMap(n => {
        if (n[2] === 0) {
          return [];
        }
        return [n];
      })
    })

    setInventory(noZeroes)
  }, []);

  return (
    <div>
      <h2 className='bank-header'>Bank</h2>
      <div className='exp'>
        <small>{`Worth: `}</small>
      </div>
      <div className='grid'>

        {inventory.map((data, index) => (
          <div key={index} className='bank-row'>
            {data.map((d, i) => (
              <>
                <Item
                  data={d}
                  index={i}
                />
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bank;