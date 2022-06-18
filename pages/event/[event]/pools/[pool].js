import React, {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import {db} from '../../../../firebase/firebase.js'

import {doc, collection, onSnapshot, setDoc} from 'firebase/firestore'

import {PoolTable} from '../../../../components/PoolTable.js'
import {PoolBouts} from '../../../../components/PoolBouts.js'

export default function Pool() {

    const router = useRouter();
    const {event, pool} = router.query
    console.log(event, pool)

    const [poolData, setPoolData] = useState()
    const [fencers, setFencers] = useState()
    const [bouts, setBouts] = useState();

    
    
    class Fencer {
        id; 
        userName;
        startingRank;
        touchesScored;
        constructor({id, userName, startingRank, touchesScored}){
            this.id = id;
            this.userName = userName;
            this.startingRank = startingRank;
            this.touchesScored = touchesScored;
        }
        updateTouchesScored = async (score) => {
            const eventRef = doc(db, "Events", event);
            const fencersRef = collection(eventRef, 'fencers');
            await setDoc(doc(fencersRef, this.id), {
                touchesScored: score,
            }, {merge: true});
        }
    }

    class Bout {
        fencerANumber;
        fencerBNumber;
        fencerAId;
        fencerBId;
        boutNumber;
        boutRef;
        poolNumber;
        id;
        fencerAScore;
        fencerBScore;
        constructor({fencerANumber, fencerBNumber,fencerAId, fencerBId, id, boutNumber, fencerAScore, fencerBScore}){
            this.fencerANumber = fencerANumber
            this.fencerBNumber = fencerBNumber
            this.fencerAId = fencerAId
            this.fencerBId = fencerBId
            this.boutNumber = boutNumber
            this.id = id;
            this.fencerAScore = fencerAScore;
            this.fencerBScore = fencerBScore;
        }
        updateScoreA = async (score) => {
            console.log('is on update score A')
            const eventRef = doc(db, "Events", event);
            const boutsRef = collection(eventRef, 'bouts');
            await setDoc(doc(boutsRef, this.id), {
                fencerAScore: score,
            }, {merge: true});
        }
        updateScoreB = async (score) => {
            const eventRef = doc(db, "Events", event);
            const boutsRef = collection(eventRef, 'bouts');
            await setDoc(doc(boutsRef, this.id), {
                fencerBScore: score,
            }, {merge: true});
        }
    }

    useEffect(async ()=>{
        console.log('is on use effect')
        if(!router.isReady) return;        
        console.log('is continuing on use effect')
        
        const eventRef = doc(db, "Events", event);
        const poolRef = doc(eventRef, "pools", pool);
        const fencersRef = collection(eventRef, 'fencers');
        const boutsRef = collection(eventRef, 'bouts');

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

        const getBouts = onSnapshot(boutsRef, (querySnapshot) => {
            const bouts = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id;
                bouts.push(new Bout({...doc.data(), id}));
            })
            setBouts(bouts);
        })

    }, [router.isReady]);

    console.log(poolData, fencers)
    if(!poolData || !fencers || !bouts){
        return null
    }
    
    // pool table and bouts are separeted into their own pages
    // data is fethed only once (on [pool].js), as table and bouts use the same data

    return (<div className='mainContent'>
        <h3> Pool {poolData.poolId}</h3>
        <PoolTable fencers={fencers}/>
        <PoolBouts fencers={fencers} bouts={bouts}/>
    </div>)
}