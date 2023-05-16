import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection } from "firebase/firestore";
import Fencer from "./Fencer.js";

const useGetFencers = (routerIsReady, eventId) => {
	const [fencers, setFencers] = useState(undefined);

	useEffect(async () => {
		if (!routerIsReady) return;

		const eventRef = doc(db, "Events", eventId);
		const fencersRef = collection(eventRef, "fencers");

		const getFencersData = onSnapshot(fencersRef, fencersSnapshot => {
			const fencersData = [];

			fencersSnapshot.forEach(doc => {
				const id = doc.id;
				fencersData.push(new Fencer({ ...doc.data(), id }));
			});
			setFencers(fencersData);
		});
	}, [eventId]);

	return { fencers: fencers };
};

export default useGetFencers;
