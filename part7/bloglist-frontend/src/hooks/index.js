import { useState } from 'react'

const useField = (label) => {
  const [value, setValue] = useState('')

  const onChange = ({ target }) => setValue(target.value)

  const reset = () => setValue('')

  return {
    reset,
    props: {
      label,
      name: label,
      id: label.toLowerCase(),
      value,
      onChange,
    }
  }
}

export default useField