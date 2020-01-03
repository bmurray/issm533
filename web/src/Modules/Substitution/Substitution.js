import React, { useState } from 'react'
import Alphabet from '../Caesar/Alphabet'
import Encrypter from '../../Utilities/Encrypter'

function Substitution(props) {
    const [key, setKey] = useState("")
    const changeKey = (e) => {
        setKey(e.target.value.toUpperCase())
    }

    const base = props.alphabet.split('')
    const set = new Set()
    const kA = key.split('')
    for (let i = 0; i < kA.length; i++) {
        set.add(kA[i])
    }
    for (let i = 0; i < base.length; i++) {
        set.add(base[i])
    }
    const shifted = Array.from(set)

    const encrypt = (text) => {
        const input = text.toUpperCase().split('')
        const output = new Array(input.length)
        for (let i = 0; i < input.length; i++) {
            let idx = base.indexOf(input[i])
            if (idx === -1) {
                output[i] = input[i]
            } else {
                output[i] = shifted[idx]
            }

        }
        return output.join('')
    }
    const decrypt = (text) => {
        const input = text.toUpperCase().split('')
        const output = new Array(input.length)
        for (let i = 0; i < input.length; i++) {
            let idx = shifted.indexOf(input[i])
            if (idx === -1) {
                output[i] = input[i]
            } else {
                output[i] = base[idx]
            }

        }
        return output.join('')
    }

    return (<div>
        Key: <input type="text" value={key} onChange={changeKey} />
        <Alphabet alphabet={base} shifted={shifted} />
        <Encrypter encrypt={encrypt} decrypt={decrypt} />

    </div>)

}

export default Substitution;