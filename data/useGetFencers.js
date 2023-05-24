import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection } from "firebase/firestore";
import Fencer from "./Fencer.js";

const useGetFencers = (eventId) => {
	const [fencers, setFencers] = useState([]);

	useEffect(async () => {
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
        return () => getFencersData()
	}, [eventId]);

	return fencers;
};

export default useGetFencers;
