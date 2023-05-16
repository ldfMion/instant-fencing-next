import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import {
	doc,
	onSnapshot,
	collection,
} from "firebase/firestore";
import Fencer from "./Fencer.js"

const useGetFencers = (routerIsReady, eventId) => {
	console.log("is on function");
	console.log("router is ready", routerIsReady);

	//const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);

	useEffect(async () => {
		console.log("is on use effect");

		if (!routerIsReady) {
			console.log("router is not ready");
			return;
		}

		console.log("is getting page data");
		const eventRef = doc(db, "Events", eventId);

        /*
		const eventResponse = await getDoc(eventRef);
		const eventData = eventResponse.data();
		console.log(eventData);
		setEventData(eventData);
        */

        /*
        const getEventData = onSnapshot(eventRef, docSnapshot => {
            const eventData = docSnapshot.data()
            setEventData(eventData)
        })
        */

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
	}, [eventId]);
	console.log("returning data");
	return {fencers: fencers };
};

export default useGetFencers;