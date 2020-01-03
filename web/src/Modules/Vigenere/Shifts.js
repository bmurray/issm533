import React from 'react'


function Shifts(props) {


    // console.log(props)

    const className = "kt-" + props.row
    return (<tr className={className}>
        <th>{props.rowVal}</th>
        {props.shifts.map((v, k) => <td key={k} className={"pt-" + k}>{v}</td>)}
    </tr>)
}

export default Shifts;