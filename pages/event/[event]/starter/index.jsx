import React from "react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/NavBar";
import useGetFencers from "../../../../data/useGetFencers"
import getServerSideEventData from "../../../../data/getServerSideEventData"
import Metadata from "../../../../components/Metadata";

const Starter = ({eventData}) => {
	const router = useRouter();
	//const { event } = router.query;
	//const routerIsReady = router.isReady;

	const fencers = useGetFencers(eventData.id);
	console.log(eventData, fencers);

	const dataIsLoaded = !!fencers;

	return (
		<>
			<Metadata title={`${eventData.name}: starter`}/>
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