import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection } from "firebase/firestore";

const useGetBouts = (eventId) => {
	const [bouts, setBouts] = useState(undefined);

	useEffect(async () => {
		const eventRef = doc(db, "Events", eventId);
		const boutsRef = collection(eventRef, "bouts");

		const getBoutsData = onSnapshot(boutsRef, boutsSnapshot => {
			const boutsData = [];

			boutsSnapshot.forEach(doc => {
				const id = doc.id;
				boutsData.push({ ...doc.data(), id });
			});
			setBouts(boutsData);
		});
        return () => getFencersData()
	}, [eventId]);
	return bouts;
};

export default useGetBouts;
