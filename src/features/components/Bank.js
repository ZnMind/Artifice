import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sell } from '../slices/bankSlice';
import Price from '../json/Pricing.json';
import '../../App.css';

// Adding mouseovers to each individual item
const Item = ({ data, index, select }) => {
  const bank = useSelector(state => state.bank);
  console.log(Price)

  return (
    <div key={index} className='slot' onClick={select}>
      <p className='bank-text'>{`${data}`}</p>
      <p className='bank-text'>{`${bank[data.split(" ")[0]][data.split(" ")[1]]}`}</p>
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
      // Array.prototype.flatMap is a way to add or remove items during a map
      return Object.keys(bank[key]).flatMap(k => {
        if (bank[key][k] > 0) {
          var temp = `${key} ${k}`
          return temp;
        }
        return [];
      })
    })
  }

  const handleSelect = event => {
    if (event.target.children.length === 0) {
      var item = event.target.parentElement.firstChild.innerText;
    } else {
      var item = event.target.firstChild.innerText;
    }

    if (select === item) {
      setSelect("");
    } else {
      setSelect(item);
    }
  }

  // Flattening array and setting inventory state
  useEffect(() => {
    var temp = objectToList();
    var tempArray = [];

    console.log(temp)
    for (let i = 0; i < temp.length; i++) {

      if (temp[i].length !== 0) {
        for (let j = 0; j < temp[i].length; j++) {
          tempArray.push(temp[i][j])
        }
      }
    }

    setInventory(tempArray);
  }, [bank]);

  return (
    <div>
      <h2 className='bank-header'>Bank</h2>
      <div className='exp'>
        <small>{`Coins: ${bank.Coins}`}</small>
      </div>

      <div className='bank-screen'>
        <div className='grid'>

          {inventory.map((data, index) => (
            <div key={index}>
              <Item
                data={data}
                index={index}
                select={handleSelect}
              />
            </div>
          ))}
        </div>

        {
          select !== ""
            ? <div className='selected'>
              <small>{select}</small>
              <p>{select ? bank[select.split(" ")[0]][select.split(" ")[1]] : ""}</p>
              <button
                className='equip-btn'
                onClick={() => dispatch(sell({ 
                  material: select.split(" ")[0], 
                  item: select.split(" ")[1], 
                  amount: 1, 
                  coins: Price[select.split(" ")[0]][select.split(" ")[1]] 
                }))}
              >Sell</button>
            </div>
            : ""
        }
      </div>
    </div>
  )
}

export default Bank;