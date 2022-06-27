import React, {useState} from 'react'

export function AddFencer(props) {

    const [value, setValue] = useState('')

    const handleChange = (e) => {
        setValue(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        props.addFencer(value)
        setValue('')
    }

    return (
    <form onSubmit={handleSubmit} className='card horizontal-form'>
        <input autoFocus type='text' value={value} onChange={handleChange} className='fill-container'/>
        <input disabled={value===''} type='submit' value='Add' className='button button-secondary'/>       
    </form>
    )
}
