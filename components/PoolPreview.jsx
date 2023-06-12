import { query, where, onSnapshot, collection, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/PoolPreview.module.css";

import useGetPoolFencers from "../data/useGetPoolFencers";
import useGetPoolBouts from "../data/useGetPoolBouts";
import extractPoolResultData from "../data/extractPoolData.js";

import PoolResultFencer from "../data/PoolResultFencer.js";

export function PoolPreview({ poolData, eventId }) {
	//for the link in the pool
	const baseURL = `/event/${eventId}/pools`;
	/*
    const eventRef = doc(db, "Events", eventId);

	const [fencers, setFencers] = useState();
	const [bouts, setBouts] = useState();

    
	useEffect(() => {
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
    */

	const fencers = useGetPoolFencers(eventId, poolData.id).map(
		fencer => new PoolResultFencer(fencer)
	);
	console.log(fencers);
	const bouts = useGetPoolBouts(eventId, poolData.poolId);
	console.log(bouts);

	const dataIsLoaded = !!fencers && !!bouts;

	const { fencersWithScoreDataFromBouts, complete } = dataIsLoaded
		? extractPoolResultData(fencers, bouts)
		: { fencersWithScoreDataFromBouts: undefined, complete: undefined };
	console.log(fencersWithScoreDataFromBouts);

	return (
		<Link href={`${baseURL}/${poolData.id}`}>
			<a className="column">
				<h4>Pool {poolData.poolId}</h4>
				<table className={`card`}>
					<thead>
						<tr >
							<th className="left-align">Fencer</th>
							<th className="success-text">V
							</th>
							<th className="fail-text">
								D
							</th>
							<th >
								M
							</th>
						</tr>
					</thead>
					<tbody>
						{fencersWithScoreDataFromBouts.map((fencer, index) => {
							console.log(fencer);
							return (
								<tr  key={fencer.id}>
									<td
                                        className={`participant-card`}
									>
										<p className={styles.rowNumber}>
											{index + 1}
										</p>
										<p className="bold left-align">
											{fencer.userName}
										</p>
									</td>
                                    <td className="success-text">{fencer.victories}</td>
                                    <td className="fail-text">{fencer.defeats}</td>
                                    <td >{fencers.length -
												1 -
												fencer.victories -
												fencer.defeats}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<button className="button button-secondary">Details</button>
			</a>
		</Link>
	);
}

const TableCell = ({children}) => <td >{children}</td>

/*

              <ol className="card">
                  {fencers.map((fencer, index) => (
                      <li key={index} className="participant-in-list">
                        <p>{index + 1}</p>
                        <p className='fill-container'>{fencer.userName}</p>
                        <div className={styles.boutStatusContainer}>
                          {bouts.map((bout) => {
                              let boutStatus;
                              if (
                                  bout.fencerAId === fencer.id
                              ) {
                                  if(bout.fencerAScore > bout.fencerBScore){
                                      boutStatus = ('victory');
                                  } else if (bout.fencerAScore < bout.fencerBScore) {
                                      boutStatus = ('defeat');
                                  } else {
                                      boutStatus = ('not-done');
                                  }
                                  return <div className={`${styles.circle} ${boutStatus === 'defeat' && 'fail'} ${boutStatus === 'victory' &&  'success'}`}></div>
                              } else if (
                                  bout.fencerBId === fencer.id
                              ) {
                                  if(bout.fencerAScore > bout.fencerBScore){
                                      boutStatus = ('defeat');
                                  } else if (bout.fencerAScore < bout.fencerBScore) {
                                      boutStatus = ('victory');
                                  } else {
                                      boutStatus = ('not-done');
                                  }
                                  return <div className={`${styles.circle} ${boutStatus === 'defeat' && 'fail'} ${boutStatus === 'victory' && 'success'}`}></div>
                              }
                              console.log('is making circles')
                          })}
                        </div>
                      </li>
                  ))}
              </ol>
 */
