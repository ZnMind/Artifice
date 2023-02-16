import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sell } from '../slices/bankSlice';
import { increment, decrement } from '../slices/bankSlice';
import { equip, unequip } from '../slices/equipmentSlice';
import Price from '../json/Pricing.json';
import '../../App.css';

// Adding selection to each individual item
const Item = ({ data, index, select }) => {
  const bank = useSelector(state => state.bank);

  return (
    <div key={index} className='slot' onClick={select}>
      <small className='bank-text'>{`${data}`}</small>
      <small className='bank-text'>{`${bank[data.split(" ")[0]][data.split(" ")[1]]}`}</small>
    </div>
  )
}

const Bank = () => {
  const dispatch = useDispatch();
  const bank = useSelector(state => state.bank);
  const equipment = useSelector(state => state.equipment);
  const [inventory, setInventory] = useState([]);
  const [select, setSelect] = useState("Stone Axe");
  const [equipArray] = useState(['Knife', 'Sword', 'Axe', 'Pick'])

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

    /* if (select === item) {
      setSelect("");
    } else { */
    setSelect(item);
    //}
  }

  const sellItem = () => {
    if (Price[select.split(" ")[0]][select.split(" ")[1]]) {
      dispatch(sell({
        material: select.split(" ")[0],
        item: select.split(" ")[1],
        amount: 1,
        coins: Price[select.split(" ")[0]][select.split(" ")[1]]
      }))
    } else if (select.split("+").length > 1) {
      dispatch(sell({
        material: select.split(" ")[0],
        item: select.split(" ")[1],
        amount: 1,
        coins: Price[select.split(" ")[0]][select.split(" ")[1].split("+")[0]] * (1 + parseInt(select.split("+")[1]))
      }))
    }

    if (bank[select.split(" ")[0]][select.split(" ")[1]] === 0) {
      setSelect("");
    }
  }

  const equipItem = () => {
    var type, currentEquip;
    const weapons = ['Knife', 'Sword', 'Axe', 'Pick']

    if (weapons.some(element => select.includes(element))) {
      type = 'Weapon';
    }

    if (type) currentEquip = equipment[type].Name;

    if (currentEquip !== '') {
      var materialUn = currentEquip.split(" ")[0];
      var itemUn = currentEquip.split(" ")[1];
      var materialEq = select.split(" ")[0];
      var itemEq = select.split(" ")[1];

      if (type) {
        dispatch(unequip({ equipment: type }));
        dispatch(increment({ material: materialUn, item: itemUn, amount: 1 }));
        dispatch(decrement({ material: materialEq, item: itemEq, amount: 1 }));
        dispatch(equip({ equipment: type, item: select }));
      }
    } else {
      var materialEq = select.split(" ")[0];
      var itemEq = select.split(" ")[1];

      if (type) {
        dispatch(decrement({ material: materialEq, item: itemEq, amount: 1 }));
        dispatch(equip({ equipment: type, item: select }));
      }
    }
  }

  // Flattening array and setting inventory state
  useEffect(() => {
    var temp = objectToList();
    var tempArray = [];

    for (let i = 0; i < temp.length; i++) {

      if (temp[i].length !== 0) {
        for (let j = 0; j < temp[i].length; j++) {
          tempArray.push(temp[i][j])
        }
      }
    }

    setInventory(tempArray);
  }, [bank]);

  useEffect(() => {
    //console.log("E")
    //setSelect("");
  }, [equipment]);

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

              {/* Equip Button */}
              {
                equipArray.some(element => select.includes(element))
                  ? <button className='equip-btn' onClick={equipItem}>Equip</button>
                  : ""
              }

              {/* Sell Button */}
              <button
                className='equip-btn'
                onClick={sellItem}
              >Sell</button>
            </div>
            : ""
        }
      </div>
    </div>
  )
}

export default Bank;