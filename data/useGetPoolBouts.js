import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { doc, onSnapshot, collection, query, where, setDoc } from "firebase/firestore";

const useGetBouts = (eventId, poolId) => {
	const [bouts, setBouts] = useState(undefined);

	useEffect(async () => {
		const eventRef = doc(db, "Events", eventId);

		const filteredBoutsRef = query(
			collection(eventRef, "bouts"),
			where("poolNumber", "==", poolId)
		);
		const getBoutsData = onSnapshot(filteredBoutsRef, querySnapshot => {
			const bouts = [];
			querySnapshot.forEach(doc => {
				const id = doc.id;
				bouts.push(new Bout({ ...doc.data(), id , eventId: eventId}));
			});
			setBouts(bouts);
		});
        return () => getBoutsData()
	}, [eventId, poolId]);
	return bouts;
};

export default useGetBouts;

class Bout {
    fencerANumber;
    fencerBNumber;
    fencerAId;
    fencerBId;
    boutNumber;
    boutRef;
    poolNumber;
    id;
    fencerAScore;
    fencerBScore;
    fencerAUserName;
    fencerBUserName;
    eventId;
    constructor({
        fencerANumber,
        fencerBNumber,
        fencerAId,
        fencerBId,
        id,
        boutNumber,
        poolId,
        fencerAScore,
        fencerBScore,
        fencerAUserName,
        fencerBUserName,
        eventId
    }) {
        this.fencerANumber = fencerANumber;
        this.fencerBNumber = fencerBNumber;
        this.fencerAId = fencerAId;
        this.fencerBId = fencerBId;
        this.boutNumber = boutNumber;
        this.poolNumber = poolId;
        this.id = id;
        this.fencerAScore = fencerAScore;
        this.fencerBScore = fencerBScore;
        this.fencerAUserName = fencerAUserName;
        this.fencerBUserName = fencerBUserName;
        if(eventId === undefined){
            throw new Error("Event id in fencer can't be undfined")
        }
        this.eventId = eventId
    }
    updateScoreA = async score => {
        const eventRef = doc(db, "Events", this.eventId);
        const boutsRef = collection(eventRef, "bouts");
        await setDoc(
            doc(boutsRef, this.id),
            {
                fencerAScore: score,
            },
            { merge: true }
        );
    };
    updateScoreB = async score => {
        const eventRef = doc(db, "Events", this.eventId);
        const boutsRef = collection(eventRef, "bouts");
        await setDoc(
            doc(boutsRef, this.id),
            {
                fencerBScore: score,
            },
            { merge: true }
        );
    };
}