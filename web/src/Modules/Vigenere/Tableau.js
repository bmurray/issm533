import React from 'react'
import Shifts from './Shifts'
import './Tableau.css'

function Tableau(props) {

    const base = props.alphabet.split('')
    const shifts = {}
    for (let shift = 0; shift < base.length; shift++) {
        const shifted = new Array(base.length)
        const n = shift < 0 ? shift + base.length : shift;
        for (let i = 0; i < base.length; i++) {
            let x = base[(i + n) % base.length]
            shifted[i] = x
        }
        shifts[base[shift]] = shifted
    }
    // console.log(shifts)

    return (<table className="vigenere">
        <thead>

            <tr>
                <td>&nbsp;</td>
                {base.map((i, k) => <th className={"pt-" + k} key={k}>{i}</th>)}
            </tr>
        </thead>
        <tbody>
            {base.map((s, k) => <Shifts key={k} row={k} rowVal={s} shifts={shifts[s]} />)}
        </tbody>
    </table>)
}

export default Tableau;