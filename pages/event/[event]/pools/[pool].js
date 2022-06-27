import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { db } from "../../../../firebase/firebase.js";

import { doc, collection, onSnapshot, setDoc, getDoc, query, where } from "firebase/firestore";

import { PoolTable } from "../../../../components/PoolTable.js";
import { PoolBouts } from "../../../../components/PoolBouts.js";
import NavBar from '../../../../components/NavBar'

export default function Pool() {
	const router = useRouter();
	const { event, pool } = router.query;
	console.log(event, pool);

	const [eventData, setEventData] = useState();
	const [poolData, setPoolData] = useState();
	const [fencers, setFencers] = useState();
	const [bouts, setBouts] = useState();

	class Fencer {
		id;
		userName;
		startingRank;
		touchesScored;
		constructor({ id, userName, startingRank, touchesScored }) {
			this.id = id;
			this.userName = userName;
			this.startingRank = startingRank;
			this.touchesScored = touchesScored;
		}
		updateTouchesScored = async score => {
			const eventRef = doc(db, "Events", event);
			const fencersRef = collection(eventRef, "fencers");
			await setDoc(
				doc(fencersRef, this.id),
				{
					touchesScored: score,
				},
				{ merge: true }
			);
		};
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
		fencerAUserName;
		fencerBUserName;
		constructor({
			fencerANumber,
			fencerBNumber,
			fencerAId,
			fencerBId,
			id,
			boutNumber,
			fencerAScore,
			fencerBScore,
			fencerAUserName,
			fencerBUserName,
		}) {
			this.fencerANumber = fencerANumber;
			this.fencerBNumber = fencerBNumber;
			this.fencerAId = fencerAId;
			this.fencerBId = fencerBId;
			this.boutNumber = boutNumber;
			this.id = id;
			this.fencerAScore = fencerAScore;
			this.fencerBScore = fencerBScore;
			this.fencerAUserName = fencerAUserName;
			this.fencerBUserName = fencerBUserName;
		}
		updateScoreA = async score => {
			console.log("is on update score A");
			const eventRef = doc(db, "Events", event);
			const boutsRef = collection(eventRef, "bouts");
			await setDoc(
				doc(boutsRef, this.id),
				{
					fencerAScore: score,
				},
				{ merge: true }
			);
		};
		updateScoreB = async score => {
			const eventRef = doc(db, "Events", event);
			const boutsRef = collection(eventRef, "bouts");
			await setDoc(
				doc(boutsRef, this.id),
				{
					fencerBScore: score,
				},
				{ merge: true }
			);
		};
	}

	useEffect(async () => {
		if (!router.isReady) return;

		const eventRef = doc(db, "Events", event);
		const poolRef = doc(eventRef, "pools", pool);
		const fencersRef = collection(eventRef, "fencers");        

        const eventResponse = await getDoc(eventRef);
        setEventData(eventResponse.data())

		const getPool = onSnapshot(poolRef, doc => {
			setPoolData(doc.data());
		});

		const getFencers = onSnapshot(fencersRef, querySnapshot => {
			const fencers = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				fencers.push(new Fencer({ ...doc.data(), id }));
			});
			fencers.sort(
				(fencerA, fencerB) =>
					fencerA.startingRank - fencerB.startingRank
			);
			console.log(fencers);
			setFencers(fencers);
		});
        
	}, [router.isReady]);

    useEffect(async () => {
        const eventRef = doc(db, "Events", event);
        const boutsRef = collection(eventRef, "bouts");
        const filteredBoutsRef = query(
			collection(eventRef, "bouts"),
			where("poolNumber", "==", poolData.poolId)
		);
		const getBouts = onSnapshot(filteredBoutsRef, querySnapshot => {
			const bouts = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				bouts.push(new Bout({ ...doc.data(), id }));
			});
			setBouts(bouts);
		});
    }, [poolData])

	console.log(poolData, fencers);
	if (!poolData || !fencers || !bouts) {
		return null;
	}

	// pool table and bouts are separeted into their own pages
	// data is fethed only once (on [pool].js), as table and bouts use the same data

	return (<>
        <NavBar
            currentTab={'pools'}
            eventName={eventData.name}
            eventId={event}
        />
		<div className="mainContent">
			<h3> Pool {poolData.poolId}</h3>
			<PoolTable fencers={fencers} bouts={bouts} />
			<PoolBouts fencers={fencers} bouts={bouts} />
		</div>
        </>);
}
