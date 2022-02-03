import { useState } from "react"

const useField = name => {
    const [value, setValue] = useState('')

    const onChange = event => {
        setValue(event.target.value)
    }

    return {
        name,
        value,
        onChange
    }
}

export default useField