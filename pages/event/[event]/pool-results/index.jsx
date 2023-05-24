import React, { useState, useEffect } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "../../../../firebase/firebase.js";
import NavBar from "../../../../components/NavBar";
import styles from "../../../../styles/PoolResults.module.css";
import Head from "next/head";

import getServerSideEventData from "../../../../data/getServerSideEventData.js";
import useGetFencers from "../../../../data/useGetFencers.js";
import useGetBouts from "../../../../data/useGetBouts.js";

const PoolResults = ({ serverSideEventData }) => {
	//const router = useRouter();
	//const { event } = router.query;
	/*
	const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);
	const [bouts, setBouts] = useState(undefined);
    */
	/*
	useEffect(() => {
		//if (!router.isReady) return;
		const eventRef = doc(db, "Events", serverSideEventData.id);

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
	}, [
        //router.isReady, 
        serverSideEventData.id]);
    */

	const fencers = useGetFencers(serverSideEventData.id);
	const bouts = useGetBouts(serverSideEventData.id);

	const dataIsLoaded = !!fencers && !!bouts;

	let newFencers;
	let complete;
	let totalVictories = 0;
	if (dataIsLoaded) {
		const keyFencers = {};
		fencers.forEach(fencer => {
			console.log(fencer);
			keyFencers[fencer.id] = fencer;
		});
		console.log(keyFencers);
		//totalVictories = 0;

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

		newFencers = Object.values(keyFencers);

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
				return (
					fencerB.victoriesOverMatches - fencerA.victoriesOverMatches
				);
			}
		});

		console.log("newFencers", newFencers);
		complete = totalVictories === bouts.length;
	}

	return (
		<>
			<Head>
				<title>{serverSideEventData.name}: pool results</title>
				<meta
					name="description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="robots" content="index, follow" />
				<meta charset="UTF-8" />
				<meta property="og:title" content="Instant Fencing Beta Test" />
				<meta
					property="og:description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta property="og:type" content="website" />
			</Head>
			<NavBar
				tabs={true}
				eventName={serverSideEventData.name}
				eventId={serverSideEventData.id}
				currentTab="pool-results"
			/>
			<div className="mainContent">
				<h3>Pool Results</h3>
				{dataIsLoaded ? (
					complete ? (
						<p>All bouts are finished!</p>
					) : (
						<p>Live results</p>
					)
				) : (
					<p>Loading</p>
				)}

				<table className={`card ${styles.table}`}>
					<thead>
						<tr className={styles.row}>
							<td>
								<p>Fencer</p>
							</td>
							<td className={styles.tableCell}>
								<p className="bold">V/M</p>
							</td>
							<td className={styles.tableCell}>
								<p className="bold">Ind</p>
							</td>
						</tr>
					</thead>
					{dataIsLoaded && (
						<tbody>
							{newFencers.map((fencer, index) => (
								<tr className={styles.row} key={index}>
									<td
										className={`${styles.tableCell} ${styles.fencerCell} participant-in-list`}
									>
										<p className={styles.rowNumber}>
											{index + 1}
										</p>
										<p className="bold left-align">
											{fencer.userName}
										</p>
									</td>
									<td
										className={`${styles.tableCell} cell-number`}
									>
										<p>
											{fencer.victoriesOverMatches
												? fencer.victoriesOverMatches.toFixed(
														3
												  )
												: 0}
										</p>
									</td>
									<td
										className={`${styles.tableCell} cell-number`}
									>
										<p>{fencer.index || 0}</p>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	return { props: { serverSideEventData } };
}

export default PoolResults;
