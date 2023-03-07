import React from "react";

export function About({ onClose }) {
    return (
        <>
            < div className="modal-box" >
                <div className="box">
                    <span className="close-icon" onClick={onClose}>x</span>
                    <p>Welcome to Artifice!</p>
                    <p>Developer: DKP</p>
                    <p>Contact me: Dkp.Artifice@gmail.com</p>
                </div>
            </div >
        </>
    )
}