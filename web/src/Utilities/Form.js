import React, { useState } from 'react'

import './Form.css'

export function Input(props) {
    const [locked, setLocked] = useState(false)
    const [active, setActive] = useState(false)
    const [error, setError] = useState(null)
    const changeValue = (e) => {
        props.setValue(e.target.value)
    }
    var fieldClassName = `field ${active && "active"}`

    return (<div className={fieldClassName}>
        <input
            type="text"
            value={props.value}
            onChange={changeValue}
            placeholder={props.label}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)} />
        <label htmlFor={1} className={error && "error"}>{error || props.label}</label>
    </div>)
}

export function Submit(props) {

    return (
        <div className="field"><input type="submit" value={props.label} /></div>)
}

export default function Form(props) {
    const submitForm = (e) => {
        e.preventDefault()
        props.submitForm()
    }

    return (<form className="form" onSubmit={submitForm}>{props.children}</form>)
}

