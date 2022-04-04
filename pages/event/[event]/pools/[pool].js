import React, {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import {db} from '../../../../firebase/firebase.js'

import {doc, collection, onSnapshot} from 'firebase/firestore'

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
    const bouts = boutOrder[fencers.length-2]
    console.log('bouts', bouts)

    return (<>
        <h3> Pool {poolData.poolId}</h3>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    {fencers.map(
                        (fencer, index) => (
                            <th key={'head'+ index}><p>{fencer.userName}</p></th>
                        )
                    )}
                    <th><p>V</p></th>
                    <th><p>TS</p></th>
                    <th><p>TR</p></th>
                    <th><p>Ind</p></th>
                    <th><p>Pl</p></th>
                </tr>
            </thead>
            <tbody>
                {fencers.map((fencer, index) => {
                    let touchesScored = 0;
                    let touchesReceived = 0;
                    let victories = 0;
                    let losses = 0;
                    return (<>
                        <tr key={'row' + index}>
                            <th><p>{index + 1}</p></th>
                            <th><p>{fencer.userName}</p></th>
                            {fencers.map((fencer, index2) => {
                                return (<td key={`row${index}column${index2}`}>
                                    {index === index2 ? null : <p>1</p>}
                                </td>)
                            })}
                        </tr>
                    </>)
                })}
            </tbody>
        </table>
        <ol>
            <li>Lista</li>
            {
                bouts.map((bout, index) => {
                    console.log('is on for each bout')
                    console.log(bout)
                    return <li key={index}>
                        <p>{index+1}</p>
                        <p>{fencers[bout[0]-1].userName}</p>
                        <p>{bout[1]}</p>
                        <input type='number'></input>
                        <input type='number'></input>
                        <p>{fencers[bout[1]-1].userName}</p>
                        <p>{bout[2]}</p>
                    </li>
                })
            }
        </ol>
    </>)
}

export const boutOrder = [
    //bout order lists the fencers' index normally, but arrays start in 0, so when used you must use -1

    //for 2 fencers
    [[1, 2]],
    //for 3 fencers
    [[1, 2], [1,3], [2,3]], 
    //for 4 fencers
    [[1, 4], [2, 3], [1, 3], [2,4], [3, 4], [1, 2]],
    //for 5 fencers
    [[1, 2], [3, 4], [5, 1], [2, 3], [5 ,4], [1, 3], [2, 5], [4, 1], [3, 5], [4,2]],
    //for 6 fencers
    [[1, 2], [4,5], [2,3], [5,6], [3,1], [2,5], [1,4], [5,3], [1,6], [4,2], [3,6], [5,1], [3,4], [6,2]],
    //for 7 fencers
    [[1, 4], [2,5], [3,6], [7,1], [5,4], [2,3],[5,1], [6,2], [5,7], [3,1], [4,6], [7,2], [3,5], [1,6], [2,4], [7,3], [6,5], [1,2], [4,7]],
    //for 8 fencers
    [[2,3], [1,5], [7,4], [6,8], [1,2], [3,4], [5,6], [8,7], [4,1], [5,2], [8,3], [6,7], [4,2], [8,1], [7,5], [3,6], [2,8], [5,4], [6,1], [3,7], [4,8], [2,6], [3,5], [1,7], [4,6], [8,5], [7,2] [1,3]],
    //for 9 fencers
    [[1,9], [2,8], [3,7], [4,6], [1,5], [2,9], [8,3], [7,4], [6,5], [1,2], [9,3], [8,4], [7,5], [6,1], [3,2], [9,4], [5,8], [7,6], [3,1], [2,4], [5,9], [8,6], [7,1], [4,3], [5,2], [6,9], [8,7], [4,1], [5,3], [6,2], [9,7], [1,8], [4,5], [3,6], [2,7], [9,8]],
    //for 10 fencers
    [[5,6], [6,9], [2,5], [7,10], [3,1], [8,6], [4,5], [9,10], [2,3], [7,8], [5,1], [10,6], [4,2], [9,7], [5,3], [10,8], [1,2], [6,7], [3,4], [8,9], [5,10], [1,6], [2,7], [3,8], [4,9], [6,5], [10,2], [8,1], [7,4], [9,3], [2,6], [5,8], [4,10], [1,9], [3,7], [8,2], [6,4], [9,5], [10,3], [7,1], [4,8], [2,9], [3,6], [5,7], [1,10]]
]