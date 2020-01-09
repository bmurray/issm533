import React, { useState } from 'react'
import Tableau from './Tableau'
import Encrypter from '../../Utilities/Encrypter'
import useSegmented from '../../Utilities/Segmented'
import './Tableau.css'

function Vigenere(props) {
    const [key, setKey] = useState("")
    const base = props.alphabet.split('')
    const [selected, segment] = useSegmented(["Repeat", "Truncate"], "Repeat")
    const changeKey = (e) => {
        let input = e.target.value.toUpperCase()

        let key = []
        for (let i = 0; i < input.length; i++) {
            if (-1 < base.indexOf(input[i])) {
                key.push(input[i])
            }
        }
        setKey(key.join(''))
    }

    const kv = key.split('')
    const encrypt = (text) => {

        var input = text.toUpperCase().split('')
        if (selected === "Truncate") {
            input.splice(key.length, input.length - key.length)
        }
        let output = new Array(input.length)
        let ki = -1;
        let idx = -1;
        for (let i = 0; i < input.length; i++) {
            idx = base.indexOf(input[i])
            if (idx < 0) {
                output[i] = input[i]
            } else {
                let kk = kv[i % kv.length]
                ki = base.indexOf(kk)

                // let x = base[(i + n) % base.length]
                let x = base[(idx + ki) % base.length]
                output[i] = x
            }
        }
        document.querySelectorAll("table.vigenere .selected").forEach((e) => e.classList.remove('selected'))
        document.querySelectorAll("table.vigenere .active").forEach((e) => e.classList.remove('active'))
        document.querySelectorAll("table.vigenere .pt-" + idx).forEach((e) => e.classList.add('active'))
        document.querySelectorAll("table.vigenere .kt-" + ki).forEach((e) => e.classList.add('active'))

        document.querySelectorAll("table.vigenere .kt-" + ki + " .pt-" + idx).forEach((e) => e.classList.add('selected'))

        return output.join('')
    }

    const decrypt = (text) => {
        var input = text.toUpperCase().split('')
        if (selected === "Truncate") {
            input.splice(key.length, input.length - key.length)
        }
        let output = new Array(input.length)
        let idx = -1;
        let ki = -1;
        for (let i = 0; i < input.length; i++) {
            idx = base.indexOf(input[i])
            if (idx < 0) {
                output[i] = input[i]
            } else {
                let kk = kv[i % kv.length]
                ki = base.indexOf(kk)

                let n = idx - ki
                if (n < 0) {
                    n += base.length
                }
                let x = base[n % base.length]
                // ki = n
                idx = n
                output[i] = x
            }
        }
        document.querySelectorAll("table.vigenere .selected").forEach((e) => e.classList.remove('selected'))
        document.querySelectorAll("table.vigenere .active").forEach((e) => e.classList.remove('active'))

        document.querySelectorAll("table.vigenere .pt-" + idx).forEach((e) => e.classList.add('active'))
        document.querySelectorAll("table.vigenere .kt-" + ki).forEach((e) => e.classList.add('active'))

        document.querySelectorAll("table.vigenere .kt-" + ki + " .pt-" + idx).forEach((e) => e.classList.add('selected'))

        return output.join('')

    }
    return (<div className="vigenere">
        <div><Tableau alphabet={props.alphabet} /></div>
        <div>
            Key: <input type="text" value={key} onChange={changeKey} />
            {segment}
            <Encrypter encrypt={encrypt} decrypt={decrypt} />
        </div>
    </div>)
}


export default Vigenere