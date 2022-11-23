import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import NavBar from "../../../../components/NavBar";
import {PoolPreview} from '../../../../components/PoolPreview'

import { db } from "../../../../firebase/firebase.js";
import { doc, onSnapshot, collection, orderBy, query } from "firebase/firestore";

export default function Pools() {
    const router = useRouter();
    const {event} = router.query
    const [eventRef, setEventRef] = useState(undefined)
    const [eventData, setEventData] = useState(undefined)
    const [pools, setPools] = useState([])

    useEffect(()=>{
        if(!router.isReady) return;        
        const eventRef = doc(db, "Events", event);
        //setEventRef(eventRef)

        const getEvent = onSnapshot(eventRef, (doc) => {
            console.log("Current data: ", doc.data());
            setEventData(doc.data())
        });

        const poolsRef = query(collection(eventRef,'pools'), orderBy("poolId", "asc"))

        const getPools = onSnapshot(poolsRef, (querySnapshot) => {
            const pools = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id
                pools.push({...doc.data(), id});
            });
            setPools(pools);
        });

        setEventRef(eventRef);

    }, [router.isReady, event]);

    if(!eventData){
        return null
    }
    console.log(pools)
    return (
        <>
            <Head>
                <title>{eventData.name}: pools</title>
                <meta name="description" content="Automate the creation of fencing competitions during practice."/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="robots" content="index, follow"/>
                <meta charset="UTF-8"/>
            </Head>
            <NavBar
                tabs={true}
                eventId={event}
                eventName={eventData.name}
                currentTab={'pools'}
            />
            <div className='mainContent'>
                <h3>Pools</h3>
                <ol className="column">
                    {pools.map((pool, index) => {
                        console.log('is on map')
                        return <PoolPreview poolData={pool} eventRef={eventRef} key={index} eventId={event}/>
                    })}
                </ol>
            </div>
        </>
    )
    /*
    console.log('is on pools')
    const router = useRouter();
    const { event } = router.query;
    console.log(router)
    const eventRef =  doc(db, "Events", event)
    const poolsRef = collection(eventRef,'pools')
    const [eventData, setEventData] = useState(undefined);
    const [pools, setPools] = useState([])

    useEffect(async () => {
        if (!router.isReady) return;
        //const eventRef = doc(db, "Events", event);
        //setEventRef(eventRef);

        const getEvent = onSnapshot(eventRef, (doc) => {
            console.log("Current data: ", doc.data());
            setEventData(doc.data());
        });

        //const getFencers = onSnapshot()

        const getPools = onSnapshot(poolsRef, (querySnapshot) => {
            const pools = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id
                pools.push({...doc.data(), id});
            });
            setPools(pools);
          });
        
    }, [router.isReady]);

    if (!eventData) {
        return null;
    }

    ;*/
}