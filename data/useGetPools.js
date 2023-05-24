import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection, orderBy, query } from "firebase/firestore";

const useGetPools = (eventId) => {
	const [pools, setPools] = useState([]);

	useEffect(async () => {
		const eventRef = doc(db, "Events", eventId);

		const poolsRef = query(collection(eventRef,'pools'), orderBy("poolId", "asc"))

        const getPools = onSnapshot(poolsRef, (querySnapshot) => {
            const pools = [];
            querySnapshot.forEach((doc) => {
                const id = doc.id
                pools.push({...doc.data(), id});
            });
            setPools(pools);
        });
        return () => getFencersData()
	}, [eventId]);

	return pools;
};

export default useGetPools;
