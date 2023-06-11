import React from "react";
import NavBar from "../../../../components/NavBar";
import styles from "../../../../styles/PoolResults.module.css";

import Metadata from "../../../../components/Metadata.jsx";
import getServerSideEventData from "../../../../data/getServerSideEventData.js";
import useGetFencers from "../../../../data/useGetFencers.js";
import useGetBouts from "../../../../data/useGetBouts.js";

import PoolResultFencer from "../../../../data/PoolResultFencer.js"
import extractPoolResultData from "../../../../data/extractPoolData";

const PoolResults = ({ serverSideEventData }) => {

	const fencers = useGetFencers(serverSideEventData.id).map(fencer => new PoolResultFencer(fencer));
	const bouts = useGetBouts(serverSideEventData.id);

	const dataIsLoaded = !!fencers && !!bouts;

	const { fencersWithScoreDataFromBouts, complete } = dataIsLoaded
		? extractPoolResultData(fencers, bouts)
		: { fencersWithScoreDataFromBouts: undefined, complete: undefined };

	return (
		<>
			<Metadata title={`${serverSideEventData.name}: pool results`} url={`instant-fencing.vercel/event/${serverSideEventData.id}/pool-results`}/>
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

				<table className={`card ${styles.table}`}>
					<thead>
						<tr className={styles.row}>
							<td>
								<p>Fencer</p>
							</td>
							<td className={styles.tableCell}>
								<p className="bold">V/M</p>
							</td>
							<td className={styles.tableCell}>
								<p className="bold">Ind</p>
							</td>
						</tr>
					</thead>
					{dataIsLoaded && (
						<tbody>
							{fencersWithScoreDataFromBouts.map((fencer, index) => (
								<tr className={styles.row} key={index}>
									<td
										className={`${styles.tableCell} ${styles.fencerCell} participant-in-list`}
									>
										<p className={styles.rowNumber}>
											{index + 1}
										</p>
										<p className="bold left-align">
											{fencer.userName}
										</p>
									</td>
									<td
										className={`${styles.tableCell} cell-number`}
									>
										<p>{fencer.victoriesOverMatches.toFixed(3)}</p>
									</td>
									<td
										className={`${styles.tableCell} cell-number`}
									>
										<p>{fencer.index || 0}</p>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	return { props: { serverSideEventData } };
}

export default PoolResults;