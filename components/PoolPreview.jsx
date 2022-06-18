import { query, where, onSnapshot, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/PoolPreview.module.css";

export function PoolPreview({ poolData, eventRef, eventId }) {
	//for the link in the pool
	const baseURL = `/event/${eventId}/pools`;

	const [fencers, setFencers] = useState();
	const [bouts, setBouts] = useState();

	useEffect(async () => {
		const filteredFencersRef = query(
			collection(eventRef, "fencers"),
			where("pool", "==", poolData.id)
		);
		const getFilteredFencers = onSnapshot(
			filteredFencersRef,
			querySnapshot => {
				const fencers = [];
				querySnapshot.forEach(doc => {
					const id = doc.id;
					fencers.push({ ...doc.data(), id });
				});
				fencers.sort(
					(fencerA, fencerB) =>
						fencerA.startingRank - fencerB.startingRank
				);
				console.log(fencers);
				setFencers(fencers);
			}
		);
		const filteredBoutsRef = query(
			collection(eventRef, "bouts"),
			where("poolNumber", "==", poolData.poolId)
		);
		const getBouts = onSnapshot(filteredBoutsRef, querySnapshot => {
			const bouts = [];
			querySnapshot.forEach(doc => {
				bouts.push(doc.data());
			});
      console.log(bouts)
			setBouts(bouts);
		});
	}, []);

	if (!fencers || !bouts) {
		return null;
	}

	return (
      <Link href={`${baseURL}/${poolData.id}`}>
          <a>
              <h4>Pool {poolData.poolId}</h4>
              <ol className="card">
                  {fencers.map((fencer, index) => (
                      <li key={index} className="participant-in-list">
                        <p>{index + 1}</p>
                        <p>{fencer.userName}</p>
                        <div className={styles.boutStatusContainer}>
                          {bouts.map((bout) => {
                              let boutStatus;
                              if (
                                  bout.fencerAUserName === fencer.userName
                              ) {
                                  if(bout.fencerAScore > bout.fencerBScore){
                                      boutStatus = ('victory');
                                  } else if (bout.fencerAScore < bout.fencerBScore) {
                                      boutStatus = ('defeat');
                                  } else {
                                      boutStatus = ('not-done');
                                  }
                                  return <div className={`${styles.circle} ${boutStatus === 'defeat' && styles.fail} ${boutStatus === 'victory' && styles.success}`}></div>
                              } else if (
                                  bout.fencerBUserName === fencer.userName
                              ) {
                                  if(bout.fencerAScore > bout.fencerBScore){
                                      boutStatus = ('defeat');
                                  } else if (bout.fencerAScore < bout.fencerBScore) {
                                      boutStatus = ('victory');
                                  } else {
                                      boutStatus = ('not-done');
                                  }
                                  return <div className={`${styles.circle} ${boutStatus === 'defeat' && styles.fail} ${boutStatus === 'victory' && styles.success}`}></div>
                              }
                              console.log('is making circles')
                          })}
                        </div>
                      </li>
                  ))}
              </ol>
              <button className="button button-primary">Details</button>
          </a>
      </Link>
	);
}