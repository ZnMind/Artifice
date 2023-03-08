import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../slices/async";

export function About({ onClose, onOpen }) {
    const dispatch = useDispatch();
    const select = useSelector(state => state.entities)
    const [data, setData] = useState();

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
                </div>
            </div >
        </>
    )
}