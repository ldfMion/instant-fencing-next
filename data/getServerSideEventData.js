import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

const getServerSideEventData = async eventId => {
	const eventRef = doc(db, "Events", eventId);
	const eventData = (await getDoc(eventRef)).data();

	delete eventData.createdAt;

	return eventData;
};

export default getServerSideEventData;
