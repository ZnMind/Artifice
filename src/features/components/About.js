import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../slices/async";

export function About({ onClose, onOpen }) {
    const dispatch = useDispatch();
    const select = useSelector(state => state.entities)
    const [data, setData] = useState();
    const [credits, setCredits] = useState(false);

    useEffect(() => {
        //dispatch(fetchTodos());
    }, [])

    return (
        <>
            < div className="modal-box" >
                <div className="box">
                    <span className="close-icon" onClick={onClose}>x</span>
                    <p>Welcome to Artifice!</p>
                    <p>Developer: DKP</p>
                    <p>Contact me: Dkp.Artifice@gmail.com</p>
                    <button onClick={onOpen}>Tutorial</button>
                    <button style={{ marginTop: '0.5em', marginBottom: '0.5em' }} onClick={() => setCredits(!credits)}>Credits</button>
                    {credits
                        ? <p>Icons are provided under CC-BY license. All credit goes to the authors at
                            <a href='https://game-icons.net/' target='_blank' rel='noreferrer' style={{ marginLeft: '0.5em', textDecoration: 'none' }}>Game-Icons</a>
                        </p>
                        : ""}
                </div>
            </div >
        </>
    )
}

export function Changes({ onClose }) {
    let version = ['0.1', '0.1.1', '0.2', '0.2.1'];
    let changeList = [
        ['Released early access game on Reddit', '11 skills to train', 'Weapons and armor up to dragon', 'Enemies to fight up to dragon'],
        ['Added Changelog', 'Made color/style changes consistent with feedback', 'QoL changes', 'Got rid of stupid smiley face'],
        ['Added images to all items!', 'Dynamic coloring of images', 'Reworked the way some components load in preperation for reworking the Progress Bar to run while on seperate tabs'],
        ['Fixed bug with smithing Dragon Scales', 'Artifice now stays on the same item when upgrading to make it easier', 'General bug fixes']
    ];
    changeList = changeList.reverse();
    return (
        <>
            < div className="modal-box" >
                <div className="box" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', top: '8vh', minHeight: '65vh', overflow: 'scroll' }}>
                    <h4 style={{ width: '100%', textAlign: 'center', borderBottom: '1px solid #fff', paddingBottom: '0.5em' }}>Changelog</h4>
                    <span className="close-icon" style={{ top: '8vh' }} onClick={onClose}>x</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {version.reverse().map((data, index) => (
                            <div key={index}>
                                <h4 style={{ marginTop: '1em' }}>{`Version - ${data}`}</h4>
                                {changeList[index].map((data, index) => (
                                    <ul key={index}>
                                        <li>{data}</li>
                                    </ul>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </>
    )
};