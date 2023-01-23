import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useSelector } from 'react-redux';

/* UNFINISHED */
/* Still working on mapping items from state object */
const BankScreen = props => {
  const [inventory, setInventory] = useState([]);
  const logs = useSelector(state => state.woodcut);
  const bank = useSelector(state => state.bank);

  useEffect(() => {
    setInventory(updateBank());
  }, []);

  const updateBank = () => {
    const keys = Object.keys(bank);
    var objArr = [];

    for (let i = 0; i < keys.length; i++) {
      if (typeof bank[keys[i]] === 'object') {
        var moreKeys = Object.keys(bank[keys[i]])
        var nestedArr = [];

        nestedArr.push(keys[i]);

        for (let j = 0; j < moreKeys.length; j++) {
          nestedArr.push(`${moreKeys[j]}`)
        }

        objArr.push(nestedArr);
      }
    }
    console.log(objArr);
    return objArr;
  }

  return (
    <div>
      Bank
      <div className='grid'>

        {inventory.map((data, index) => (
          <div key={index} className='slot'>
            {/* {
              typeof data === 'object'
                ? "Y"
                : "N"
            } */}
            {data}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BankScreen;