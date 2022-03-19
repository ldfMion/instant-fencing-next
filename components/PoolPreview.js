import { query, where, onSnapshot, orderBy } from 'firebase/firestore'
import React, {useEffect, useState} from 'react'

export function PoolPreview({poolData, fencersRef}) {

  console.log('is on pool preview')
  console.log(poolData.fencers)
  const [fencers, setFencers] = useState()

  useEffect(async() => {
    console.log('is on use effect')
    console.log(poolData.id)
    const filteredFencersRef = query(fencersRef, where("pool", "==", poolData.id), orderBy("startingRank", "asc"));
    const getFilteredFencers = onSnapshot(filteredFencersRef, (querySnapshot) => {
      const fencers = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id
          fencers.push({...doc.data(), id});
      });
      console.log(fencers)
      setFencers(fencers) 
    });
  }, [])

  console.log(fencers)

  if(!fencers){
    return null
  }

  return (
    <>
      <h4>Pool {poolData.poolId}</h4>
      <ol className='card'>
        {fencers.map((fencer, index) => <li key={index} >
            <p>{index+1}   </p>
            <p>{fencer.userName}</p>
        </li>)}
      </ol>
    </>
  )
}
