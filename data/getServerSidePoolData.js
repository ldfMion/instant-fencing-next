import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

const getServerSidePoolData = async (eventId, poolId) => {
    if(eventId === undefined || eventId === "undefined"){
        throw new Error("event id can't be undefined")
    } else if (poolId === undefined || poolId === "undefined"){
        throw new Error("pool id can't be undefined")
    }
	const eventRef = doc(db, "Events", eventId);
    const poolRef = doc(eventRef, "pools", poolId);
    const response = await getDoc(poolRef)
	const poolData = response.data()
    poolData.id = response.id

	delete poolData.createdAt;

	return poolData;
};

export default getServerSidePoolData;
