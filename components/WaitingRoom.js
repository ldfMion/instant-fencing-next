import React from 'react'
import { useEffect, useState } from 'react';

import { collection, query, where, getDocs, addDoc} from "firebase/firestore";

export function WaitingRoom(props) {

    console.log('is in wairing room');
    console.log(props.eventData);

    const [fencers, setFencers] = useState(false)

    const [joined, setJoined] = useState(false)

    useEffect(async () => {
        console.log('is on use effect')
        const fencersRef = collection(props.eventRef, 'fencers')
        const fencersDocs  = getDocs(fencersRef)
        const fencers = [];
        (await fencersDocs).forEach(doc => fencers.push(doc.data()))
        console.log(fencers)
        setFencers(fencers)
    }, [])

    const join = async () => {
        const fencerRef = await addDoc(collection(props.eventRef, 'fencers'), {
            userName: props.user.displayName,
            id: props.user.uid
        })
    }

    return (<>
        <div className='mainContent'>
            <h3>Waiting Room</h3>
            {
                fencers ? 
                <ul className='card'>
                    {fencers.map(fencer => <li><p>{fencer.userName}</p></li>)}
                </ul> :
                <p>Join or add fencers</p>
            }
        </div>
        {!joined && 
            <div className='button-container'>
                <button className='button button-primary' onClick={join}>Join</button>
            </div>
        }
    </>)
}
