import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

const getServerSideEventData = async eventId => {
    if(eventId === undefined || eventId === "undefined"){
        throw new Error("event id can't be undefined")
    }
	const eventRef = doc(db, "Events", eventId);
    const response = await getDoc(eventRef)
	const eventData = response.data()
    eventData.id = response.id

	delete eventData.createdAt;

	return eventData;
};

export default getServerSideEventData;
