import { query, where, onSnapshot, orderBy } from 'firebase/firestore'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'

export function PoolPreview({poolData, fencersRef, eventId}) {

  //for the link in the pool
  const baseURL = `/event/${eventId}/pools`


  const [fencers, setFencers] = useState()

  useEffect(async() => {
    console.log('is on use effect')
    console.log(poolData.id)
    //const filteredFencersRef = query(fencersRef, where("pool", "==", poolData.id), orderBy("startingRank", "asc"));
    const filteredFencersRef = query(fencersRef, where("pool", "==", poolData.id));
    const getFilteredFencers = onSnapshot(filteredFencersRef, (querySnapshot) => {
      const fencers = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id
          fencers.push({...doc.data(), id});
      });
      fencers.sort((fencerA, fencerB) => fencerA.startingRank - fencerB.startingRank)
      console.log(fencers)
      setFencers(fencers) 
    });
  }, [])

  console.log(fencers)

  if(!fencers){
    return null
  }

  return (
    <Link href={`${baseURL}/${poolData.id}`}><a>
      <h4>Pool {poolData.poolId}</h4>
      <ol className='card'>
        {fencers.map((fencer, index) => <li key={index} className='participant-in-list' >
            <p>{index+1}</p>
            <p>{fencer.userName}</p>
        </li>)}
      </ol>
      <button className='button button-primary'>Details</button>
      </a></Link>
  )
}
