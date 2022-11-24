import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router'
import Head from "next/head";

//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
//import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db} from '../../../firebase/firebase.js'

import NavBar from '../../../components/NavBar';
import {WaitingRoom} from '../../../components/WaitingRoom.jsx';
import {SelectSortType} from '../../../components/SelectSortType.jsx';
import {SortByRank} from '../../../components/SortByRank.jsx';
import {SetPools} from '../../../components/SetPools.jsx';

const Create = ({eventName}) => {
    console.log('from server side', eventName)
    console.log("create page")
    const router = useRouter();
    const {event} = router.query
    console.log(event)
    //const auth = getAuth();
    const [user] = useAuthState(auth);
    const [eventRef, setEventRef] = useState(undefined)
    const [eventData, setEventData] = useState(undefined)
    
    useEffect(()=>{
        if(!router.isReady) return;        
        const eventRef = doc(db, "Events", event);
        setEventRef(eventRef)

        const getEvent = onSnapshot(eventRef, (doc) => {
            console.log("Current data: ", doc.data());
            setEventData(doc.data())
        });

    }, [router.isReady, event]);

    if(!eventData){
        return null
    }

    const metaTags = <Head>
        <title>{eventName}: creating event</title>
        <meta name="description" content={`Someone is inviting you to participate in ${eventName}`}/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="index, follow"/>
        <meta charset="UTF-8"/>
    </Head>

    if(!eventData.fencersAreChosen){
        return (<>
            {metaTags}
            <NavBar eventName={eventData.name}/>
            <WaitingRoom users={eventData.users} eventRef={eventRef} user={user}/>
        </>);
    }
    console.log(eventRef)
    console.log(eventData.sortType)
    if(!eventData.sortType){
        return (<>
            {metaTags}
            <NavBar eventName={eventData.name}/>
            <SelectSortType eventRef={eventRef} user={user}/>
        </>)
    }
    if(!eventData.fencersAreSorted && eventData.sortType === 'By Rank'){
        return <>
            {metaTags}
            <NavBar eventName={eventData.name}/>
            <SortByRank eventRef={eventRef} user={user}/>
        </>
    }
    if(!eventData.poolsAreSet){
        return <>
            {metaTags}
            <NavBar eventName={eventData.name}/>
            <SetPools eventRef={eventRef} user={user} />
        </>
    }
    router.push(`/event/${event}/pools`)
    return null
}

export async function getServerSideProps({params}) {
    // Fetch data from external API
    console.log(params.id)
    const eventRef = doc(db, "Events", params.event);

    const eventName = (await getDoc(eventRef)).data().name;
  
    // Pass data to the page via props
    return { props: { eventName } }
  }

export default Create;