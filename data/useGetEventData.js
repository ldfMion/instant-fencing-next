import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot } from "firebase/firestore";

const useGetEventData = (eventId) => {
    const eventRef = doc(db, "Events", eventId);

	const [eventData, setEventData] = useState(undefined);
    
	useEffect(() => {
		const getEvent = onSnapshot(eventRef, doc => {
			console.log("Current data: ", doc.data());
			setEventData(doc.data());
		});
        return () => getEvent()
	}, [eventId]);
    return eventData
}

export default useGetEventData;