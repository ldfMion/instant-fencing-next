import React from "react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/NavBar";
import { db } from "../../../../firebase/firebase.js";
import {
	doc,
    getDoc
} from "firebase/firestore";
import useGetFencers from "../../../../data/useGetFencers"
import Head from "next/head";

const Starter = ({eventData}) => {
	const router = useRouter();
	const { event } = router.query;
	const routerIsReady = router.isReady;

	const { fencers } = useGetFencers(
		routerIsReady,
		event
	);
	console.log(eventData, fencers);

	const dataIsLoaded = !!fencers;

	return (
		<>
			<Head>
				<title>{eventData.name}: starter</title>
				<meta
					name="description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="robots" content="index, follow" />
				<meta charset="UTF-8" />
				<meta property="og:title" content="Instant Fencing Beta Test" />
				<meta
					property="og:description"
					content="Automate the creation of fencing competitions during practice."
				/>
				<meta property="og:type" content="website" />
			</Head>
			<NavBar
				tabs={true}
				eventName={eventData.name}
				eventId={eventData.name}
				currentTab="starter"
			/>
			{dataIsLoaded && (
				<div className="mainContent">
					<h3>Starter</h3>
					<ol className="card column">
						{fencers
							.sort(
								(fencerA, fencerB) =>
									fencerA.startingRank - fencerB.startingRank
							)
							.map((fencer, index) => (
								<li key={index} className="participant-in-list">
									<p>{fencer.userName}</p>
									<p>{index + 1}</p>
								</li>
							))}
					</ol>
				</div>
			)}
		</>
	);
};

export default Starter;

export async function getServerSideProps({params}) {
    // Fetch data from external API
    console.log(params.id)
    const eventRef = doc(db, "Events", params.event);

    const eventData = (await getDoc(eventRef)).data()
    delete eventData.createdAt
  
    // Pass data to the page via props
    console.log(eventData)
    return { props: { eventData } }
  }

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
