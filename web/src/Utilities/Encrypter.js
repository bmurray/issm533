import React, { useState, useEffect } from 'react'
import useSegmented from './Segmented'

function Encrypter(props) {
    const [input, setInput] = useState("")
    const changeInput = (e) => {
        setInput(e.target.value)
    }
    useEffect(() => {

    }, [input])

    const [selected, segment] = useSegmented(["Encrypt", "Decrypt"], "Encrypt")

    const encrypted = selected === "Encrypt" ? props.encrypt(input) : props.decrypt(input)
    return (<div class="encrypter">
        <h3>Enter text to encrypt</h3>
        <textarea onChange={changeInput} value={input} /><br />
        {segment}<br />
        <div className="encrypted">{encrypted}</div>

    </div>)
}

export default Encrypter;