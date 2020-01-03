import React from 'react'
import './Caesar.css'

function Alphabet(props) {


    return (<table className="alphabet">
        <tbody>
            <tr>
                <th>Plaintext</th>
                {props.alphabet.map((c, idx) => (<td key={idx}>{c}</td>))}
            </tr>
            <tr>
                <th>Ciphertext</th>
                {props.shifted.map((c, idx) => (<td key={idx}>{c}</td>))}
            </tr>
        </tbody>
    </table>)

}

export default Alphabet;