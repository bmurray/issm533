import React, { useState } from 'react'

import Form, { Input, Submit } from '../../Utilities/Form'
import './Hashcat.css'
function Hashcat(props) {

    const url = (props.secure ? "https://" : "http://") + props.host + "/password"
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [passwords, setPasswords] = useState([])
    const submitForm = (e) => {
        console.log("Save Password")
        const data = { user: user, password: password }
        const response = fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((v) => {
            if (v.status !== 200) {
                console.log("Cannot Save")
            }
            setPassword("")
            showPasswords()
        })
    }

    const showPasswords = (e) => {
        if (user === null || user === "") {
            return
        }
        fetch(url + "?user=" + user, {
            headers: {
                'Accept': 'application/json',
            }
        }).then((v) => v.json()).then((j) => {
            console.log(j)
            setPasswords(j)
        })
    }
    const style = {
        maxWidth: "50%",
    }
    return (<div>
        <h1>Hashcat Test Data</h1>
        <div className="hashcat-flex">


            <div>
                <span>Please enter a username and password. NOTE: Please do NOT use a password that you use normally! These passwords are not stored safely, and will be cracked!</span>
                <Form submitForm={submitForm}>
                    <Input label="Username" value={user} setValue={setUser} />
                    <Input label="Password" value={password} setValue={setPassword} />
                    <Submit label="Save Password" />
                </Form>
            </div>
            <div>
                {/* <button onClick={showPasswords}>Show Passwords</button> */}
                <Passwords passwords={passwords} />
            </div>
        </div>
    </div>)
}

function Passwords(props) {
    const encodings = ["md5", "sha1", "sha512", "md5-salted", "sha512-salted", "pbkdf2-md5", "pbkdf2-sha512", "bcrypt", "scrypt"]

    return (<table className="hashcat passwords">
        <thead>
            <tr>
                <th>Password</th>{props.passwords.map((pwd) => (<React.Fragment><th>{pwd.Plain}</th></React.Fragment>))}
            </tr>
        </thead>
        <tbody>
            {encodings.map((e, i) => (<Encoding key={i} encoding={e} passwords={props.passwords} />))}
        </tbody>
    </table>)
}
function Encoding(props) {
    const enc = props.encoding
    const encoded = props.passwords.map((p) => {
        for (var i in p.Encodings) {
            const encoding = p.Encodings[i]
            console.log(encoding)

            if (encoding.Encoding === enc) {
                return encoding
            }
        }
        return { Encoded: "", Duration: "" }
    })
    return (<tr><th>{enc}</th>{encoded.map((e) => (<Encoded encoded={e} />))}</tr>)
}
function Encoded(props) {
    return (<React.Fragment><td>{props.encoded.Duration}</td></React.Fragment>)

}

export default Hashcat;