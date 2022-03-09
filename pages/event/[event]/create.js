import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router'

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

import {NavBar} from '../../../components/NavBar.js';
import {WaitingRoom} from '../../../components/WaitingRoom.js';

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

const Event = () => {
    const router = useRouter();
    const {event} = router.query
    console.log(event)
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [eventRef, setEventRef] = useState(undefined)
    const [eventData, setEventData] = useState(undefined)

    useEffect(async ()=>{
        if(!router.isReady) return;        
        const eventRef = doc(db, "Events", event);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();
        setEventRef(eventRef)
        setEventData(eventData)
        console.log(eventData)
        // codes using router.query

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

    return <p>create next step</p>
}

export default Event;