import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sell } from '../slices/bankSlice';
import Price from '../json/Pricing.json';
import '../../App.css';

// Adding mouseovers to each individual item
const Item = ({ data, index, select }) => {
  const [hover, setHover] = useState(false);

  const change = () => {
    setHover(!hover);
  }

  return (
    <div key={index} className='slot' onClick={select}>
      <p className='bank-text'>{`${data[0]} ${data[1]}`}</p>
      <p className='bank-text'>{data[2]}</p>
      {
        hover
          ? <div className='btn-div'>
            <button className='equip-btn'>Sell</button>
            <button className='equip-btn'>Equip</button>
          </div>
          : ""
      }
    </div>
  )
}

const Bank = () => {
  const dispatch = useDispatch();
  const [inventory, setInventory] = useState([]);
  const [select, setSelect] = useState("");
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

  const handleSelect = event => {
    var item = event.target.firstChild.innerText;
    
    if (select === item) {
      setSelect("");
    } else {
      setSelect(item);
    }
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
  }, [bank]);

  return (
    <div>
      <h2 className='bank-header'>Bank</h2>
      <div className='exp'>
        <small>{`Worth: ${bank.Coins}`}</small>
      </div>
      <div className='bank-screen'>

      {
            select !== ""
              ? <div className='selected'>
                <small>{select}</small>
                <p>{bank[select.split(" ")[0]][select.split(" ")[1]]}</p>
                <button 
                  className='equip-btn'
                  onClick={() => dispatch(sell({ material: select.split(" ")[0], item: select.split(" ")[1], amount: 1, coins: 5 }))}
                  >Sell</button>
              </div>
              : ""
          }
        <div className='grid'>
          

          {inventory.map((data, index) => (
            <div key={index} className='bank-row'>
              {data.map((d, i) => (
                <div key={i}>
                  <Item
                    data={d}
                    index={i}
                    select={handleSelect}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        
          
        
      </div>
    </div>
  )
}

export default Bank;