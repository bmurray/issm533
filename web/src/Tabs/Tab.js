import React from 'react'

function Tab(props) {

    const setActive = () => {
        console.log(props)
        props.setActive(props.dataKey)
    }
    return (<button className={props.active === props.dataKey ? "tablink active" : "tablink"} onClick={setActive}>{props.name}</button>)
}

export default Tab;