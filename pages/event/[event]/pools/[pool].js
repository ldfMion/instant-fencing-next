import React, {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import {db} from '../../../../firebase/firebase.js'

import {doc, collection, onSnapshot} from 'firebase/firestore'

import {PoolTable} from '../../../../components/PoolTable.js'
import {PoolBouts} from '../../../../components/PoolBouts.js'

export default function Pool() {

    const router = useRouter();
    const {event, pool} = router.query
    console.log(event, pool)

    const [poolData, setPoolData] = useState()
    const [fencers, setFencers] = useState()

    useEffect(async ()=>{
        console.log('is on use effect')
        if(!router.isReady) return;        
        console.log('is continuing on use effect')
        const eventRef = doc(db, "Events", event);
        const poolRef = doc(eventRef, "pools", pool);
        const fencersRef = collection(eventRef, 'fencers')

        const getPool = onSnapshot(poolRef, (doc) => {
            setPoolData(doc.data())
        });

        const getFencers = onSnapshot(fencersRef, (querySnapshot) => {
            const fencers = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id
                fencers.push({...doc.data(), id});
            });
            fencers.sort((fencerA, fencerB) => fencerA.startingRank - fencerB.startingRank)
            console.log(fencers)
            setFencers(fencers) 
        })

    }, [router.isReady]);

    console.log(poolData, fencers)
    if(!poolData || !fencers){
        return null
    }
    // pool has at least 2 fencers, so index 0 has bouts for 2 fencers

    return (<>
        <h3> Pool {poolData.poolId}</h3>
        <PoolTable fencers={fencers}/>
        <PoolBouts fencers={fencers}/>
    </>)
}