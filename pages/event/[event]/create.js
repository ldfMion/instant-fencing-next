import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router'

//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { doc, onSnapshot } from "firebase/firestore";
//import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db} from '../../../firebase/firebase.js'

import NavBar from '../../../components/NavBar';
import {WaitingRoom} from '../../../components/WaitingRoom.js';
import {SelectSortType} from '../../../components/SelectSortType.js';
import {SortByRank} from '../../../components/SortByRank.js';
import {SetPools} from '../../../components/SetPools.js';

const Create = () => {
    const router = useRouter();
    const {event} = router.query
    console.log(event)
    //const auth = getAuth();
    const [user] = useAuthState(auth);
    const [eventRef, setEventRef] = useState(undefined)
    const [eventData, setEventData] = useState(undefined)
    
    useEffect(async ()=>{
        if(!router.isReady) return;        
        const eventRef = doc(db, "Events", event);
        setEventRef(eventRef)

        const getEvent = onSnapshot(eventRef, (doc) => {
            console.log("Current data: ", doc.data());
            setEventData(doc.data())
        });

    }, [router.isReady]);

    if(!eventData){
        return null
    }

    if(!eventData.fencersAreChosen){
        return (<>
            <NavBar eventName={eventData.name}/>
            <WaitingRoom eventData={eventData} eventRef={eventRef} user={user}/>
        </>);
    }
    console.log(eventRef)
    console.log(eventData.sortType)
    if(!eventData.sortType){
        return (<>
            <NavBar eventName={eventData.name}/>
            <SelectSortType eventRef={eventRef} user={user}/>
        </>)
    }
    if(!eventData.fencersAreSorted && eventData.sortType === 'By Rank'){
        return <>
            <NavBar eventName={eventData.name}/>
            <SortByRank eventRef={eventRef} user={user}/>
        </>
    }
    if(!eventData.poolsAreSet){
        return <>
            <NavBar eventName={eventData.name}/>
            <SetPools eventRef={eventRef} />
        </>
    }
    router.push(`/event/${event}/pools`)
    return null
}

export default Create;