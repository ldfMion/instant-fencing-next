import React from 'react'
import { useEffect, useState } from 'react';

import { collection, query, where, getDocs, addDoc, onSnapshot, deleteDoc, setDoc, doc} from "firebase/firestore";

import {AddFencer} from '../components/AddFencer.js'
import { LogPrompt } from './LogPrompt.js';

export function WaitingRoom(props) {

    const [fencers, setFencers] = useState(false)

    const fencersRef = collection(props.eventRef, 'fencers')

    const [logPrompt, setLogPrompt] = useState(false)

    const [userIsJoined, setUserIsJoined] = useState(false)

    useEffect(async () => {
        console.log('is on use effect')
        const getFencers = onSnapshot(fencersRef, (snapshot) => {
            const fencers = [];
            snapshot.forEach(doc => {
                const id = doc.id;
                fencers.push({...doc.data(), id})
            });
            console.log(fencers)
            setFencers(fencers)
            setUserIsJoined(fencers.some((fencer) => fencer.id === props.user.uid))
        })
    }, [])

    const join = async () => {
        if(props.user){
            const fencerRef = await setDoc(doc(props.eventRef, 'fencers', props.user.uid), {
                userName: props.user.displayName,
                id: props.user.uid
            })
        }
        else {
            console.log(props.user)
            setLogPrompt(true)
        }
    }

    const leave = async () => {
        await deleteDoc(doc(fencersRef, props.user.uid))
    }
    
    const addFencer = async (fencer) => {
        const fencerRef = await addDoc(collection(props.eventRef, 'fencers'), {
            userName: fencer
        })
    }

    const removeFencer = async (id) => {
        console.log(id)
        await deleteDoc(doc(fencersRef, id))
    }

    const thisIsMe = async (id) => {
        removeFencer(id);
        join();
    }

    const createEvent = async() => {
        await setDoc(props.eventRef, {
            fencersAreChosen: true
        }, {merge: true})
    }

    if(!fencers){return null}

    return (<>
        <div className='mainContent'>
            <h3>Waiting Room</h3>
            <div className='card horizontal-form'>
                <p>{window.location.href}</p>
                <button className='button button-secondary' onClick={()=> navigator.clipboard.writeText(window.location.href)}>Copy</button>
            </div>
            <AddFencer addFencer={addFencer}/>
            {
                fencers.length!==0 ? 
                <ul className='card'>
                    {fencers.map((fencer, index) => <li key={index} className="participant-in-list">
                        <p>{fencer.userName}</p>
                        {
                            props.user &&
                            (
                                fencer.id === props.user.uid ? 
                                <button className='button button-secondary' onClick={leave}>Leave</button> :
                                <div>
                                    <button className='button button-terciary' onClick={() => removeFencer(fencer.id)}>Remove</button>
                                    {!userIsJoined && <button className='button button-terciary' onClick={() => thisIsMe(fencer.id)}>This is me</button>}
                                </div>
                            )

                        }
                    </li>)}
                </ul> :
                <p>Join or add fencers</p>
            }
        </div>
        <div className='button-container'>
            {
                props.user && userIsJoined ?
                <button className='button button-primary' onClick={createEvent}>Done</button> :
                <button className='button button-primary' onClick={join}>Join</button>  
            }
        </div>
        {(logPrompt && !props.user) && <LogPrompt/> }
    </>)
}
