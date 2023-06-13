import { db } from "../firebase/firebase.js";
import { doc, collection } from "firebase/firestore";

import Fencer from "./Fencer.js"

export default class PoolFencer extends Fencer{
    //touchesScored;
    eventId;
    constructor({ id, userName, startingRank, touchesScored, eventId}) {
        super({id, userName, startingRank})
        //this.touchesScored = touchesScored;
        if(eventId === undefined){
            throw new Error("Event id in fencer can't be undfined")
        }
        this.eventId = eventId;
    }
    /*
    updateTouchesScored = async score => {
        const eventRef = doc(db, "Events", this.eventId);
        const fencersRef = collection(eventRef, "fencers");
        await setDoc(
            doc(fencersRef, this.id),
            {
                touchesScored: score,
            },
            { merge: true }
        );
    };*/
}