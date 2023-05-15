import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/NavBar";
import { db } from "../../../../firebase/firebase.js";
import {
	doc,
	onSnapshot,
	collection,
} from "firebase/firestore";
import Head from "next/head";

const useGetEventAndFencersData = (routerIsReady, event) => {
	console.log("is on function");
	console.log("router is ready", routerIsReady);

	const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);

	useEffect(async () => {
		console.log("is on use effect");

		if (!routerIsReady) {
			console.log("router is not ready");
			return;
		}

		console.log("is getting page data");
		const eventRef = doc(db, "Events", event);

        /*
		const eventResponse = await getDoc(eventRef);
		const eventData = eventResponse.data();
		console.log(eventData);
		setEventData(eventData);
        */

        const getEventData = onSnapshot(eventRef, docSnapshot => {
            const eventData = docSnapshot.data()
            setEventData(eventData)
        })

        /*
		const fencersRef = collection(eventRef, "fencers");

		const fencersSnap = await getDocs(fencersRef);
		const fencersData = [];
		fencersSnap.forEach(fencerSnap => {
			const id = fencerSnap.id;
			fencersData.push(new Fencer({ ...fencerSnap.data(), id }));
		});
		setFencers(fencersData);
        */

		const fencersRef = collection(eventRef, "fencers");

        const getFencersData = onSnapshot(fencersRef, fencersSnapshot => {
            console.log("is getting fencers")
            const fencersData = [];
            fencersSnapshot.forEach(doc => {
                const id = doc.id;
                fencersData.push(new Fencer({ ...doc.data(), id }));
            });
            console.log(fencers)
            setFencers(fencersData);
        })

		console.log("seetting fencers");
		console.log("got data");
	}, [event]);
	console.log("returning data");
	return { eventData: eventData, fencers: fencers };
};

const Starter = () => {
	const router = useRouter();
	const { event } = router.query;
	const routerIsReady = router.isReady;

	const { eventData, fencers } = useGetEventAndFencersData(
		routerIsReady,
		event
	);
	console.log(eventData, fencers);

	const dataIsLoaded = eventData && fencers;

	return (
		<>
			<Head>
				<title>{dataIsLoaded && eventData.name}: starter</title>
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
				eventName={dataIsLoaded && eventData.name}
				eventId={event}
				currentTab="starter"
			/>
			{dataIsLoaded && (
				<div className="mainContent">
					<h3>Starter</h3>
					<ol className="card column">
						{fencers
							.sort(
								(fencerA, fencerB) =>
									fencerA.startingRank - fencerB.startingRank
							)
							.map((fencer, index) => (
								<li key={index} className="participant-in-list">
									<p>{fencer.userName}</p>
									<p>{index + 1}</p>
								</li>
							))}
					</ol>
				</div>
			)}
		</>
	);
};

export default Starter;

class Fencer {
	id;
	startingRank;
	//pool;
	userName;
	constructor({ id, userName, startingRank }) {
		this.id = id;
		this.userName = userName;
		this.startingRank = startingRank;
	}
}
