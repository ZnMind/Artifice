import React, { useState, useEffect, Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sell } from '../slices/bankSlice';
import { increment, decrement } from '../slices/bankSlice';
import { equip, unequip } from '../slices/equipmentSlice';
import Price from '../json/Pricing.json';
import multipliers from '../json/Multipliers.json';
import { img, colorChange, loadSelect } from '../images/imageHelper';
import '../../App.css';

// Adding selection to each individual item
const Item = ({ data, index, select }) => {
  const bank = useSelector(state => state.bank);
  let type = data.split("+")[0].split(" ")[1];

  return (
    <div key={index} className='slot' onClick={select}>
      <small className='bank-text'>{`${data}`}</small>
      {img[type] ? <object className='color-svg' data={img[type]} alt='' height='30px' width='30px' type='image/svg+xml' onLoad={colorChange}></object> : ""}
      <small className='bank-text'>{`${bank[data.split(" ")[0]][data.split(" ")[1]]}`}</small>
    </div>
  )
}

const Bank = () => {
  const dispatch = useDispatch();
  const bank = useSelector(state => state.bank);
  const character = useSelector(state => state.character);
  const equipment = useSelector(state => state.equipment);
  const style = useSelector(state => state.combat.Style);
  const [inventory, setInventory] = useState([]);
  const [select, setSelect] = useState("");
  const [pricing, setPricing] = useState("");
  const [stats, setStats] = useState([]);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [weaponArray] = useState(['Knife', 'Sword', 'Scimitar', 'Axe', 'Pick', 'Rod']);
  const [armorArray] = useState(['Helm', 'Chest', 'Gloves', 'Legs', 'Boots', 'Shield']);

  // Converting state object into an array
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
    let item;
    if (event.target.children.length === 0) {
      item = event.target.parentElement.firstChild.innerText;
    } else {
      item = event.target.firstChild.innerText;
    }
    setSelect(item);
    if (item.split("+").length > 1) {
      setPricing(Price[item.split(" ")[0]][item.split(" ")[1].split("+")[0]] * (1 + parseInt(item.split("+")[1])))
    } else {
      setPricing(Price[item.split(" ")[0]][item.split(" ")[1]]);
    }
  }

  const sellItem = () => {
    if (Price[select.split(" ")[0]][select.split(" ")[1]]) {
      dispatch(sell({
        material: select.split(" ")[0],
        item: select.split(" ")[1],
        amount: amount,
        coins: Price[select.split(" ")[0]][select.split(" ")[1]] * amount
      }))
    } else if (select.split("+").length > 1) {
      dispatch(sell({
        material: select.split(" ")[0],
        item: select.split(" ")[1],
        amount: amount,
        coins: Price[select.split(" ")[0]][select.split(" ")[1].split("+")[0]] * (1 + parseInt(select.split("+")[1])) * amount
      }))
    }

    if (bank[select.split(" ")[0]][select.split(" ")[1]] - amount === 0) {
      setSelect("");
    }
  }

  const equipItem = () => {
    var type, currentEquip;

    if (weaponArray.some(element => select.includes(element))) {
      type = 'Weapon';
    } else {
      if (select.split(" ")[1].split("+")[0] === 'Shield') {
        type = 'Offhand';
      } else {
        type = select.split(" ")[1].split("+")[0];
      }
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
    setSelect("");
    setTimeout(colorChange, 100);
  }

  const gearBonus = () => {
    let base, atk, str, multi, gather, def;
    if (weaponArray.some(element => select.includes(element))) {
      base = multipliers['Materials'][select.split(" ")[0]]
      str = Math.round(multipliers['Style'][select.split(" ")[1].split("+")[0]].Mult * base);
      atk = Math.round(multipliers['Style'][select.split(" ")[1].split("+")[0]][style] * base);

      if (select.split("+").length > 1) {
        multi = 1 + parseInt(select.split("+")[1]) / 10;
        base *= multi;
        str = Math.round(str * multi);
        atk = Math.round(atk * multi);
      }

      if (['Axe', 'Pick', 'Rod'].some(element => select.includes(element))) {
        gather = base;
      }
      return [atk, str, gather];
    }

    if (armorArray.some(element => select.includes(element))) {
      base = multipliers['Materials'][select.split(" ")[0]];
      def = Math.round(multipliers['Style'][select.split(" ")[1].split("+")[0]] * base);

      if (select.split("+").length > 1) {
        multi = 1 + parseInt(select.split("+")[1]) / 10;
        base *= multi;
        def = Math.round(def * multi);
      }
      console.log(def)
      return [def];
    }
  }

  const handleAmount = event => {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)))
    console.log(value);
    setAmount(value)
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
    const gear = gearBonus();
    if (gear) setStats(gear);
    setAmount(1);
  }, [select, style]);

  useEffect(() => {
    colorChange();
  }, [equipment]);

  return (
    <div id='bank-tab'>
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
              <div className='inner-selected'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <small style={{ marginBottom: '1em' }}>{select}</small>
                  {img[select.split("+")[0].split(" ")[1]] ?
                    <object
                      className='color-svg second'
                      data={img[select.split("+")[0].split(" ")[1]]}
                      alt=''
                      height='50px'
                      type='image/svg+xml'
                      onLoad={e => loadSelect(e.target)}
                      ></object>
                    : ""}
                  <p style={{ marginTop: '0.5em' }}>{select ? bank[select.split(" ")[0]][select.split(" ")[1]] : ""}</p>
                </div>
                {
                  weaponArray.some(element => select.includes(element))
                    ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <small>{`Attack: ${stats[0]}`}</small>
                      <small>{`Strength: ${stats[1]}`}</small>
                      {stats[2] ? <small style={{ marginTop: "1em" }}>{`Gathering: +${stats[2]}%`}</small> : ""}
                    </div>
                    : ""
                }
                {
                  armorArray.some(element => select.includes(element))
                    ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <small>{`Defense: ${stats[0]}`}</small>
                    </div>
                    : ""
                }

                <small style={{ display: 'block' }}>{`Price: ${pricing}`}</small>
                {/* Equip Button */}
                {
                  weaponArray.some(element => select.includes(element))
                    ? character.Attack.level >= multipliers['Requirements'][select.split(" ")[0]]
                      ? <button className='equip-btn' onClick={equipItem}>Equip</button>
                      : <small style={{ color: 'lightslategray' }}>{`Need ${multipliers['Requirements'][select.split(" ")[0]]} attack`}</small>
                    : ""
                }

                {
                  armorArray.some(element => select.includes(element))
                    ? character.Defense.level >= multipliers['Requirements'][select.split(" ")[0]]
                      ? <button className='equip-btn' onClick={equipItem}>Equip</button>
                      : <small style={{ color: 'lightslategray' }}>{`Need ${multipliers['Requirements'][select.split(" ")[0]]} defense`}</small>
                    : ""
                }

                {/* Sell Button */}
                <button className='equip-btn' onClick={sellItem}>Sell</button>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5em', marginBottom: '0.5em' }}>
                  <input
                    value={amount}
                    onChange={handleAmount}
                    type="number"
                    min={1}
                    max={bank[select.split(" ")[0]][select.split(" ")[1]]}
                    style={{ textAlign: 'center', borderRadius: '5px' }}
                  />
                </div>
              </div>
            </div>
            : ""
        }
      </div>
    </div>
  )
}

export default Bank;