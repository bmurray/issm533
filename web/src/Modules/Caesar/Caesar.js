import React, { useState } from 'react'
import Alphabet from './Alphabet'
import Spinner from '../../Utilities/Spinner'
import Encrypter from '../../Utilities/Encrypter'
function Caesar(props) {
    const [shift, setShift] = useState(0)

    const base = props.alphabet.split('')
    let shifted = new Array(base.length)
    const n = shift < 0 ? shift + base.length : shift;
    for (let i = 0; i < base.length; i++) {
        let x = base[(i + n) % base.length]
        shifted[i] = x
    }
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
        <Spinner value={shift} setValue={setShift} />
        <Alphabet alphabet={base} shifted={shifted} />
        <Encrypter encrypt={encrypt} decrypt={decrypt} />
    </div>
    )
}

export default Caesar;