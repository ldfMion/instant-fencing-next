import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router'

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";

import {NavBar} from '../../components/NavBar.js'

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
    const [eventData, setEventData] = useState(undefined)

    useEffect(async ()=>{
        if(!router.isReady) return;        
        const eventRef = doc(db, "Events", event);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();
        setEventData(eventData)
        console.log(eventData)
        // codes using router.query

    }, [router.isReady]);

    if(!eventData){
        return null
    }

    return (<>
        <NavBar eventName={eventData.name}/>
    </>);
}

export default Event;