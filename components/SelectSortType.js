import React, { useState } from "react";

import {setDoc} from "firebase/firestore";

export function SelectSortType(props) {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = async (event) => {
        console.log('is submitting')
        event.preventDefault();
        await setDoc(props.eventRef, {
            sortType: value
        }, {merge: true});
    }
    console.log(value)
    console.log(props.eventRef)
    return (
            <form  onChange={handleChange} onSubmit={handleSubmit}>
                <div className='mainContent'>
                    <h3>Select Competition Sort Type</h3>
                    <ul className='card column'>
                        <li className="participant-in-list">
                            <label htmlFor="Randomly">Randomly</label>
                            <input
                                type="radio"
                                id="Randomly"
                                name="sort"
                                value="Randomly"
                            />

                        </li>
                        <li className="participant-in-list">
                            <label htmlFor="By Rank">By Rank</label>
                            <input type="radio" id="By Rank" name="sort" value="By Rank" />
                        </li>
                    </ul>
                    {value === '' && <p>Choose how the fencers will be sorted into pools.</p>}
                    {value === 'Randomly' && <p>Fencers will be sorted randomly into pools.</p>}
                    {value === 'By Rank' && <p>Select Fencers from best to worst. This rank will be used to arrage them in pools.</p>}
                </div>
                <div className='button-container'>
                    <button className='button-primary' type='submit' disabled={value === ""}>Confirm</button>
                </div>
            </form>
    );
}
