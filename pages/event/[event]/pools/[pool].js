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
    
    class Fencer {
        id; 
        userName;
        startingRank;
        constructor({id, userName, startingRank}){
            this.id = id;
            this.userName = userName;
            this.startingRank = startingRank;
        }
    }

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
                fencers.push(new Fencer({...doc.data(), id}));
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
    
    // pool table and bouts are separeted into their own pages
    // data is fethed only once (on [pool].js), as table and bouts use the same data

    return (<div className='mainContent'>
        <h3> Pool {poolData.poolId}</h3>
        <PoolTable fencers={fencers}/>
        <PoolBouts fencers={fencers}/>
    </div>)
}