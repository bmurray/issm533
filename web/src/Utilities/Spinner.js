import React from 'react'
import './Utility.css'

function Spinner(props) {


    const deltaShift = (i) => {
        return () => {
            props.setValue(props.value + i)
            // console.log(i)
        }
    }

    return (<span className="spinner">
        <i className="fas fa-minus" onClick={deltaShift(-1)}></i><span>{props.value}</span><i className="fas fa-plus" onClick={deltaShift(1)}></i>
    </span>)
}

export default Spinner;