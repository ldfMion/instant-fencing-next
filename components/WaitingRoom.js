import React from 'react'
import { useEffect, useState } from 'react';

import { collection, query, where, getDocs, addDoc, onSnapshot, deleteDoc, setDoc, doc} from "firebase/firestore";

export function WaitingRoom(props) {

    console.log('is in wairing room');
    console.log(props.eventData);

    const [fencers, setFencers] = useState(false)

    const [joined, setJoined] = useState(false)

    const fencersRef = collection(props.eventRef, 'fencers')

    useEffect(async () => {
        console.log('is on use effect')
        /*
        const fencersDocs = await getDocs(fencersRef)*/
        const unsubscribe = onSnapshot(fencersRef, (snapshot) => {
            const fencers = [];
            snapshot.forEach(doc => fencers.push(doc.data()))
            console.log(fencers)
            setFencers(fencers)
        })
    }, [])

    const join = async () => {
        const fencerRef = await setDoc(doc(props.eventRef, 'fencers', props.user.uid), {
            userName: props.user.displayName,
            id: props.user.uid
        })
    }

    const leave = async () => {
        await deleteDoc(doc(fencersRef, props.user.uid))
    }

    if(!fencers){return null}

    return (<>
        <div className='mainContent'>
            <h3>Waiting Room</h3>
            {
                fencers.length!==0 ? 
                <ul className='card'>
                    {fencers.map(fencer => <li>
                        <p>{fencer.userName}</p>
                        {
                            fencer.id === props.user.uid ? 
                            <button className='button button-secondary' onClick={leave}>Leave</button> :
                            <button className='button button-terciary'>Remove</button>
                        }
                    </li>)}
                </ul> :
                <p>Join or add fencers</p>
            }
        </div>
        <div className='button-container'>
            {
                (!fencers.some((fencer) => fencer.id === props.user.uid)) ?
                <button className='button button-primary' onClick={join}>Join</button>  :
                <button className='button button-primary' >Done</button> 
            }
        </div>
        
    </>)
}
