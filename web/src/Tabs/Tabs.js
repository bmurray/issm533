import React, { useState, useEffect } from 'react';
import './Tabs.css';
import Tab from './Tab'

function Tabs(props) {
    var def = 0
    if (props.defaultValue) {
        props.tabs.forEach((v, i) => def = v.name === props.defaultValue ? i : def)
    }
    console.log("Default", def)

    const [tab, setTab] = useState(def)
    useEffect(() => {
        console.log(tab)
    }, [tab])

    return (
        <div>
            <div className="tabs">
                {props.tabs.map((x, key) => (<Tab key={key} dataKey={key} active={tab} setActive={setTab} name={x.name} />))}
            </div>

            {props.tabs.map((t, i) => (<div className={"tabcontent " + (i === tab ? "active" : "hidden")} > {t.tab}</div>))}


        </div >
    );
}

// {/* <Tab key="0" dataKey="0" active={tab} setActive={setTab} name="Test 0" />
// <Tab key="1" dataKey="1" active={tab} setActive={setTab} name="Test 1" /> */}

export default Tabs;