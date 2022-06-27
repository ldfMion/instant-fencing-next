import React, { useState, useEffect } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "../../../../firebase/firebase.js";
import NavBar from "../../../../components/NavBar";
import styles from "../../../../styles/PoolResults.module.css";

const PoolResults = () => {
	const router = useRouter();
	const { event } = router.query;
	const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);
	const [bouts, setBouts] = useState(undefined);

	class Fencer {
		id;
		//startingRank not needed
		pool;
		userName;
		victories = 0;
		defeats = 0;
		touchesScored = 0;
		touchesReceived = 0;
		constructor({ id, pool, userName }) {
			this.id = id;
			this.pool = pool;
			this.userName = userName;
		}
	}

	useEffect(async () => {
		if (!router.isReady) return;
		const eventRef = doc(db, "Events", event);

		const getEvent = onSnapshot(eventRef, doc => {
			//console.log("Current data: ", doc.data());
			setEventData(doc.data());
		});

		const fencersRef = collection(eventRef, "fencers");

		const getFencers = onSnapshot(fencersRef, querySnapshot => {
			const fencersData = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				console.log(doc.data());
				console.log(id);
				const fencerObject = new Fencer({ ...doc.data(), id });
				console.log(fencerObject);
				fencersData.push(fencerObject);
			});
			console.log("fromDatabase", fencersData);
			setFencers(fencersData);
		});

		const boutsRef = collection(eventRef, "bouts");

		const getBouts = onSnapshot(boutsRef, querySnapshot => {
			const bouts = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				bouts.push({ ...doc.data(), id });
			});
			setBouts(bouts);
		});
	}, [router.isReady]);

	if (!fencers || !bouts) {
		return null;
	}

	const keyFencers = {};
	fencers.forEach(fencer => {
		console.log(fencer);
		keyFencers[fencer.id] = fencer;
	});

    let totalVictories = 0;

	bouts.forEach(bout => {
		keyFencers[bout.fencerAId].touchesScored += bout.fencerAScore;
		keyFencers[bout.fencerAId].touchesReceived += bout.fencerBScore;
		keyFencers[bout.fencerBId].touchesScored += bout.fencerBScore;
		keyFencers[bout.fencerBId].touchesReceived += bout.fencerAScore;
		if (bout.fencerAScore > bout.fencerBScore) {
			keyFencers[bout.fencerAId].victories++;
			keyFencers[bout.fencerBId].defeats++;
            totalVictories++;
		} else if (bout.fencerAScore < bout.fencerBScore) {
			keyFencers[bout.fencerAId].defeats++;
			keyFencers[bout.fencerBId].victories++;
            totalVictories++;
		} else {
			//tie
		}
	});

	const newFencers = Object.values(keyFencers);

	newFencers.forEach(fencer => {
		fencer.victoriesOverMatches =
			fencer.victories + fencer.defeats === 0
				? 0
				: fencer.victories / (fencer.victories + fencer.defeats);
		fencer.index = fencer.touchesScored - fencer.touchesReceived;
	});

	newFencers.sort((fencerA, fencerB) => {
		if (fencerA.victoriesOverMatches === fencerB.victoriesOverMatches) {
			return fencerB.index - fencerA.index;
		} else {
			return fencerB.victoriesOverMatches - fencerA.victoriesOverMatches;
		}
	});

	console.log("newFencers", newFencers);
    const complete = totalVictories === bouts.length;

    if(!eventData){
        return null
    }

	return (
		<>
			<NavBar
				tabs={true}
				eventName={eventData.name}
                eventId={event}
				currentTab="pool-results"
			/>
			<div className="mainContent">
				<h3>Pool Results</h3>
				<table className={`card ${styles.table}`}>
						<tr className={styles.row}>
                            <td className='center-align'><p>Fencer</p></td>
							<td className={styles.tableCell}>
								<p className='bold'>V/M</p>
							</td>
							<td className={styles.tableCell}>
								<p className='bold'>Ind</p>
							</td>
						</tr>
                        {newFencers.map((fencer, index) => (
						<tr className={styles.row}>
							<td className={`${styles.tableCell} ${styles.fencerCell}`}>
                                <p className={styles.rowNumber}>{index + 1}</p>
                                <p className='bold'>{fencer.userName}</p>
                            </td>
							<td className={`${styles.tableCell} cell-number`}><p>{fencer.victoriesOverMatches}</p></td>
							<td className={`${styles.tableCell} cell-number`}><p>{fencer.index}</p></td>
						</tr>
					))}
				</table>
                {complete ? <p>All bouts are finished!</p> : <p>Live results</p>}
			</div>
		</>
	);
};

export default PoolResults;
