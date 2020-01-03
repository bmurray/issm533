import React, { useState, useEffect } from 'react';
import './Tabs.css';
import Tab from './Tab'

function Tabs(props) {
    const [tab, setTab] = useState(0)

    useEffect(() => {
        console.log(tab)
    }, [tab])
    return (
        <div>
            <div className="tabs">
                {props.tabs.map((x, key) => (<Tab key={key} dataKey={key} active={tab} setActive={setTab} name={x.name} />))}
            </div>

            <div className="tabcontent">{props.tabs[tab].tab}</div>

        </div>
    );
}

// {/* <Tab key="0" dataKey="0" active={tab} setActive={setTab} name="Test 0" />
// <Tab key="1" dataKey="1" active={tab} setActive={setTab} name="Test 1" /> */}

export default Tabs;