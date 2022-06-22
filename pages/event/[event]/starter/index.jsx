import React, {useState, useEffect} from 'react'
import { useRouter } from "next/router";
import NavBar from '../../../../components/NavBar';
import { db } from "../../../../firebase/firebase.js";
import { doc, onSnapshot, collection, getDoc, getDocs } from "firebase/firestore";

const Starter = () => {

    const router = useRouter();
	const { event } = router.query;

	const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);

    class Fencer {
		id;
        startingRank;
		//pool;
		userName;
		constructor({ id, userName, startingRank }) {
			this.id = id;
			this.userName = userName;
            this.startingRank = startingRank;
		}
	}

    useEffect(async () => {
		if (!router.isReady) return;
		const eventRef = doc(db, "Events", event);

        const eventData = await getDoc(eventRef);
        setEventData(eventData.data());

		const fencersRef = collection(eventRef, "fencers");

        const fencersSnap = await getDocs(fencersRef);
        const fencersData = [];
        fencersSnap.forEach(fencerSnap => {
            const id = fencerSnap.id;
            fencersData.push(new Fencer({...fencerSnap.data(), id}));

        })
        setFencers(fencersData)

	}, [router.isReady]);

    if(!eventData || !fencers){
        return null
    }

    return (<>
        <NavBar
				tabs={true}
				eventName={eventData.name}
                eventId={event}
				currentTab="starter"
			/>
            <div className="mainContent">
                <h3>Pool Results</h3>
                <ol className='card column'>
                        {fencers.sort((fencerA, fencerB) => fencerA.startingRank - fencerB.startingRank).map((fencer, index) => <li key={index} className="participant-in-list">
                            <p>{fencer.userName}</p>
                            <p>{index+1}</p>
                        </li>)}
                </ol>
        </div>
    </>)
}

export default Starter;