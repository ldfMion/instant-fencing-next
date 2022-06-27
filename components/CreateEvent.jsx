import React, {useState} from 'react'

export const CreateEvent = (props) => {
    const [value, setValue] = useState('');
    const handleChange = (event) =>  {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        props.createEvent(value, 'competition');
    }
    
    return(
        <form className='horizontal-form'>
            <input className='fill-container' autoFocus type='text' value={value} onChange={handleChange} placeholder='Name your event'/>
            <button className='button-primary' disabled={value === ''} onClick={handleSubmit}>Create</button>
        </form>
    )
}
