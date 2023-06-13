import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";

import PoolFencer from "./PoolFencer.js"

const useGetFencers = (eventId, poolId) => {
	const [fencers, setFencers] = useState([]);

	useEffect(async () => {
		const eventRef = doc(db, "Events", eventId);
		const fencersRef = collection(eventRef, "fencers");
		const filteredFencersRef = query(
			fencersRef,
			where("pool", "==", poolId)
		);

		const getFencersData = onSnapshot(filteredFencersRef, querySnapshot => {

			const fencers = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				fencers.push(new PoolFencer({ ...doc.data(), id, eventId}));
			});
			fencers.sort(
				(fencerA, fencerB) =>
					fencerA.startingRank - fencerB.startingRank
			);
			setFencers(fencers);
		});
        return () => getFencersData()
	}, [eventId, poolId]);

	return fencers;
};

export default useGetFencers;