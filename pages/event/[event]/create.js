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

/*
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
*/
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
        /*

        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();
        setEventRef(eventRef)
        setEventData(eventData)
        console.log(eventData)
        */
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
            <SelectSortType eventRef={eventRef}/>
        </>)
    }
    if(!eventData.fencersAreSorted && eventData.sortType === 'By Rank'){
        return <>
            <NavBar eventName={eventData.name}/>
            <SortByRank eventRef={eventRef}/>
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