import React, { useState, useEffect, useRef } from 'react';
import Bank from '../json/bank.json';
import Character from '../json/character.json';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../App.css';
import { useSelector } from 'react-redux';

const Progress = props => {
    return <ProgressBar now={props.progress} label={`${props.type}: ${(100 - props.progress) / 20}s`} />;
}

const BankScreen = props => {
    const [backpack, setBackpack] = useState(props.backpack);
    const logs = useSelector(state => state.woodcut)
    console.log(logs);

    return (
        <div>
            Bank
            {backpack.map((data, index) => (
            <div key={index}>
              {/* Object.keys(data).map((key, index) => (
                <div key={index}>
                  {key}
                </div>
              )) */}

              <p>{data.wood.normal}</p>
              <p>{data.wood.oak}</p>
            </div>
          ))}
        </div>
    )
}

export default BankScreen;