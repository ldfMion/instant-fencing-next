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
import Fencer from "../../../../data/Fencer.js"

const PoolResults = ({ serverSideEventData }) => {

	const fencers = useGetFencers(serverSideEventData.id).map(fencer => new PoolResultFencer(fencer));
	const bouts = useGetBouts(serverSideEventData.id);

	const dataIsLoaded = !!fencers && !!bouts;

	const { newFencers, complete } = dataIsLoaded
		? extractPoolResultData(fencers, bouts)
		: { newFencers: undefined, complete: undefined };

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
										<p>{fencer.victoriesOverMatches.toFixed(3)}</p>
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

const extractPoolResultData = (fencers, bouts) => {

    const fencersMap = fencers.reduce((map, fencer) => map.set(fencer.id, fencer), new Map())
    
	let complete = true;

	bouts.forEach(bout => {

        const fencerA = fencersMap.get(bout.fencerAId);
        const fencerB = fencersMap.get(bout.fencerBId);

		fencerA.addTouchesScored(bout.fencerAScore);
		fencerA.addTouchesReceived(bout.fencerBScore);
		fencerB.addTouchesScored(bout.fencerBScore);
		fencerB.addTouchesReceived(bout.fencerAScore);

		if (bout.fencerAScore > bout.fencerBScore) {
			fencerA.incrementVictories();
			fencerB.incrementDefeats();

		} else if (bout.fencerAScore < bout.fencerBScore) {
			fencerA.incrementDefeats();
			fencerB.incrementVictories();

		} else {
			complete = false;
		}
	});

	const newFencers = getSortedFencersForPoolResults(Array.from(fencersMap.values()));

	return {
		newFencers,
		complete,
	};
};

function getSortedFencersForPoolResults(fencersArray){

    const newFencers = [...fencersArray]

    newFencers.sort((fencerA, fencerB) => {
		if (fencerA.victoriesOverMatches === fencerB.victoriesOverMatches) {
			return fencerB.index - fencerA.index;
		} else {
			return fencerB.victoriesOverMatches - fencerA.victoriesOverMatches;
		}
	});
    
    return newFencers
    
}

class PoolResultFencer extends Fencer {

    touchesScored = 0;
    touchesReceived = 0;
    victories = 0;
    defeats = 0;

    constructor(args){
        super(args)
    }

    incrementVictories(){
        this.victories++;
    }
    incrementDefeats(){
        this.defeats++;
    }
    addTouchesScored(boutTouches){
        this.validateTouchesToAdd(boutTouches)
        this.touchesScored += boutTouches
    }
    addTouchesReceived(boutTouches){
        this.validateTouchesToAdd(boutTouches)
        this.touchesReceived += boutTouches
    }
    validateTouchesToAdd(boutTouches){
        if(boutTouches < 0) throw new Error("can't add negative touches")
    }
    get victoriesOverMatches(){
        if(this.noBoutsFenced()){
            return 0;
        }
        return this.victories / (this.victories + this.defeats);
    }
    get index(){
        return this.touchesScored - this.touchesReceived
    }
    noBoutsFenced() {
        return this.victories + this.defeats === 0
    }
}