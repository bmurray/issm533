import React, { useState } from 'react'

function useSegmented(values, def) {
    const x = values.indexOf(def)
    const [value, setValue] = useState(x > 0 ? x : 0)
    const setIndex = (i) => {
        return () => {
            setValue(i)
        }
    }
    const v = (<span className="segmented">
        {
            values.map((o, idx) => (<span key={idx} className={idx === value ? "selected" : ""} onClick={setIndex(idx)}>{o}</span>))
        }
    </span>)

    return [values[value], v]
}

export default useSegmented;