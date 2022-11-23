import React, {useState, useEffect} from 'react'
import { useRouter } from "next/router";
import NavBar from '../../../../components/NavBar';
import { db } from "../../../../firebase/firebase.js";
import { doc, onSnapshot, collection, getDoc, getDocs } from "firebase/firestore";
import Head from "next/head";

const Starter = () => {

    const router = useRouter();
	const { event } = router.query;

	const [eventData, setEventData] = useState(undefined);
	const [fencers, setFencers] = useState(undefined);

    useEffect(() => {
		if (!router.isReady) return;

        async function getPageData(){
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
        }
        getPageData();

	}, [router.isReady, event]);

    if(!eventData || !fencers){
        return null
    }

    return (<>
        <Head>
            <title>{eventData.name}: starter</title>
            <meta name="description" content="Automate the creation of fencing competitions during practice."/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="robots" content="index, follow"/>
            <meta charset="UTF-8"/>
        </Head>
        <NavBar
				tabs={true}
				eventName={eventData.name}
                eventId={event}
				currentTab="starter"
			/>
            <div className="mainContent">
                <h3>Starter</h3>
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