import React, { useState } from "react";

export function Tutorial({ status }) {
    const [page, setPage] = useState(1);

    const Page1 = () => {
        return (
            <>
                <p>[ Tutorial ]</p>
                <p>Welcome to Artifice!</p>
                <p>This is the [ Bank ] tab where you can interact with all the items you have gathered in the game.</p>
                <p>Try equipping your Stone Pick for the next part of the tutorial!</p>
            </>
        )
    }

    const Page2 = () => {
        return (
            <>
                <p>[ Mining ]</p>
                <p>Now that you have your Pick equipped try navigating to the [ Mining ] tab on the left</p>
                <p>and mining some Copper!</p>
                <p>The speed is determined by how strong your tool is!</p>
            </>
        )
    }

    const Page3 = () => {
        return (
            <>
                <p>[ Smithing ]</p>
                <p>On the [ Smithing ] tab try smithing a Copper Bar with the ore you just gathered.</p>
                <p>Once you have your bar, try smithing a Copper Knife.</p>
                <p>This will be your first weapon!</p>
            </>
        )
    }

    const Page4 = () => {
        return (
            <>
                <p>[ Artifice ]</p>
                <p>The [ Artifice ] tab is where you make your gear even more powerful.</p>
                <p>Try collecting 2 Bars and upgrading the weapon you just made!</p>
                <p>There is no level cap, but cost scales quickly.</p>
            </>
        )
    }

    const Page5 = () => {
        return (
            <>
                <p>[ Tutorial ]</p>
                <p>Upgrading your equipment as high as you can is the basis of this game.</p>
                <p>With stronger tools you gather materials and level up skills faster,</p>
                <p>and with stronger weapons and armor you can kill greater foes.</p>
            </>
        )
    }

    const Page6 = () => {
        return (
            <>
                <p>[ Adventure ]</p>
                <p>The [ Adventure ] tab is where you can kill monsters for loot.</p>
                <p>There is a special place called the Grove where animals drop hides</p>
                <p>which can be crafted into armor and upgraded the same as weapons!</p>
            </>
        )
    }

    const Page7 = () => {
        return (
            <>
                <p>[ Combat ]</p>
                <p>You can train different combat styles by selecting them on the left.</p>
                <p>Attack: Accuracy, Strength: Max hit, and Defense: Evasion</p>
                <p>Also, certain weapons are better for training certain stats.</p>
            </>
        )
    }

    const Page8 = () => {
        return (
            <>
                <p>You will need very strong tools, weapons, and armor to advance.</p>
                <p>That's all for the time being,</p>
                <p>now go see if you can slay all the monsters!</p>
                <p>( This tutorial can be found in the [ About ] tab )</p>
            </>
        )
    }

    const pages = {
        'page1': <Page1 />,
        'page2': <Page2 />,
        'page3': <Page3 />,
        'page4': <Page4 />,
        'page5': <Page5 />,
        'page6': <Page6 />,
        'page7': <Page7 />,
        'page8': <Page8 />
    }

    return (
        <>
            <div className="modal-box" >
                <div className="tutorial">
                    <span className="close-tutorial" onClick={status}>x</span>
                    {pages[`page${page}`]}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={`arrowT ${page === 1 ? 'disabled' : 'arrowT-left'}`} onClick={() => page > 1 ? setPage(page - 1) : ""}></div>
                        <div>{`${page} / 8`}</div>
                        <div className={`arrowT ${page === Object.keys(pages).length ? 'disabled' : 'arrowT-right'}`} onClick={() => page < Object.keys(pages).length ? setPage(page + 1) : ""}></div>
                    </div>
                </div>
            </div>
        </>
    )
}