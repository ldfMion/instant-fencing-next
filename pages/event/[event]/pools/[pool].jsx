import React, { useEffect, useState } from "react";
import Head from "next/head";

import { useRouter } from "next/router";

import { db } from "../../../../firebase/firebase.js";
import { useAuthState } from 'react-firebase-hooks/auth';

import { doc, collection, onSnapshot, setDoc, getDoc, query, where } from "firebase/firestore";

import { PoolTable } from "../../../../components/PoolTable.jsx";
import { PoolBouts } from "../../../../components/PoolBouts.jsx";
import NavBar from '../../../../components/NavBar'

export default function Pool() {
	const router = useRouter();
	const { event, pool } = router.query;

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
        if(!db || !event){
            return
        }
		const eventRef = doc(db, "Events", event);
		const poolRef = doc(eventRef, "pools", pool);
		

        const eventResponse = await getDoc(eventRef);
        setEventData(eventResponse.data())

		const getPool = onSnapshot(poolRef, doc => {
            const id = doc.id;
			setPoolData({...doc.data(), id});
		});

        
        
	}, [router.isReady]);

    useEffect(() => {
        if(!poolData) return
        const eventRef = doc(db, "Events", event);
        const boutsRef = collection(eventRef, "bouts");

        const fencersRef = collection(eventRef, "fencers");
        const filteredFencersRef = query(fencersRef, where("pool", "==", poolData.id));

        console.log('is on log 1')

		const getFencers = onSnapshot(filteredFencersRef, querySnapshot => {
            console.log('is getting fencers')
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
		}, [event, pool]);

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
            console.log(bouts)
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
        <Head>
            <title>{eventData.name}: Pool {poolData.poolId}</title>
            <meta name="description" content="Automate the creation of fencing competitions during practice."/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="robots" content="index, follow"/>
            <meta charset="UTF-8"/>
        </Head>
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
