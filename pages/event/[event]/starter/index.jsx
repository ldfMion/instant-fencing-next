import React from "react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/NavBar";
import useGetFencers from "../../../../data/useGetFencers"
import getServerSideEventData from "../../../../data/getServerSideEventData"
import Head from "next/head";

const Starter = ({eventData}) => {
	const router = useRouter();
	//const { event } = router.query;
	//const routerIsReady = router.isReady;

	const fencers = useGetFencers(eventData.id);
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
				eventId={eventData.id}
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
    const eventData = await getServerSideEventData(params.event)
    return { props: { eventData } }
  }