import React from "react";
import NavBar from "../../../../components/NavBar";
import styles from "../../../../styles/PoolResults.module.css";

import Metadata from "../../../../components/Metadata.jsx";
import getServerSideEventData from "../../../../data/getServerSideEventData.js";
import useGetFencers from "../../../../data/useGetFencers.js";
import useGetBouts from "../../../../data/useGetBouts.js";

import PoolResultFencer from "../../../../data/PoolResultFencer.js";
import extractPoolResultData from "../../../../data/extractPoolData";
import ParticipantCard from "../../../../components/ParticipantCard";

const PoolResults = ({ serverSideEventData }) => {
	const fencers = useGetFencers(serverSideEventData.id).map(
		fencer => new PoolResultFencer(fencer)
	);
	const bouts = useGetBouts(serverSideEventData.id);

	const dataIsLoaded = !!fencers && !!bouts;

	const { fencersWithScoreDataFromBouts, complete } = dataIsLoaded
		? extractPoolResultData(fencers, bouts)
		: { fencersWithScoreDataFromBouts: undefined, complete: undefined };

	return (
		<>
			<Metadata
				title={`${serverSideEventData.name}: pool results`}
				url={`instant-fencing.vercel/event/${serverSideEventData.id}/pool-results`}
			/>
			<NavBar
				eventName={serverSideEventData.name}
				eventId={serverSideEventData.id}
				currentTab="pool-results"
			/>
			<div className="mainContent">
				<h3>Pool Results</h3>
				{dataIsLoaded ? (
					complete ? (
						<p>All bouts are finished!</p>
					) : (
						<p>Live results</p>
					)
				) : (
					<p>Loading</p>
				)}

				<table className={`card`}>
					<thead>
						<tr>
							<th className="left-align">Fencer</th>
							<th>V/M</th>
							<th>Ind</th>
						</tr>
					</thead>
					{dataIsLoaded && (
						<tbody>
							{fencersWithScoreDataFromBouts.map(
								(fencer, index) => (
									<tr className={styles.row} key={fencer.id}>
										<td >
                                            <ParticipantCard fencerUserName={fencer.userName} number={index + 1}/>
										</td>
										<td>
											<p>
												{fencer.victoriesOverMatches.toFixed(
													3
												)}
											</p>
										</td>
										<td>
											<p>{fencer.index || 0}</p>
										</td>
									</tr>
								)
							)}
						</tbody>
					)}
				</table>
                <div className="card column">
                    <p><span className="bold">V/M</span>: Number of victories divided by the number of matches.</p>
                    <p><span className="bold">Ind</span>: Touches scored minus touches received.</p>
                </div>
			</div>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	return { props: { serverSideEventData } };
}

export default PoolResults;
