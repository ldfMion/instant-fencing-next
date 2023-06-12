import React from "react";
import Link from "next/link";
import styles from "../../../../styles/PoolPreview.module.css";

import useGetPoolFencers from "../../../../data/useGetPoolFencers.js";
import useGetPoolBouts from "../../../../data/useGetPoolBouts.js";
import extractPoolResultData from "../../../../data/extractPoolData.js";

import PoolResultFencer from "../../../../data/PoolResultFencer.js";
import ParticipantCard from "../../../../components/ParticipantCard";

export function PoolPreview({ poolData, eventId }) {
	//for the link in the pool
	const baseURL = `/event/${eventId}/pools`;

	const fencers = useGetPoolFencers(eventId, poolData.id).map(
		fencer => new PoolResultFencer(fencer)
	);
	console.log(fencers);
	const bouts = useGetPoolBouts(eventId, poolData.poolId);
	console.log(bouts);

	const dataIsLoaded = !!fencers && !!bouts;

	const { fencersWithScoreDataFromBouts, complete } = dataIsLoaded
		? extractPoolResultData(fencers, bouts)
		: { fencersWithScoreDataFromBouts: [], complete: false };
	console.log(fencersWithScoreDataFromBouts);

	return (
		<Link href={`${baseURL}/${poolData.id}`}>
			<a className="column">
				<h4>Pool {poolData.poolId}</h4>
				<table className={`card`}>
					<thead>
						<tr >
							<th className="left-align">Fencer</th>
							<th className="success-text">V
							</th>
							<th className="fail-text">
								D
							</th>
							<th >
								M
							</th>
						</tr>
					</thead>
					<tbody>
						{fencersWithScoreDataFromBouts.map((fencer, index) => {
							console.log(fencer);
							return (
								<tr  key={fencer.id}>
									<td
									>
										<ParticipantCard fencerUserName={fencer.userName} number={index + 1}/>
									</td>
                                    <td className="success-text">{fencer.victories}</td>
                                    <td className="fail-text">{fencer.defeats}</td>
                                    <td >{fencers.length -
												1 -
												fencer.victories -
												fencer.defeats}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<button className="button button-secondary">Details</button>
			</a>
		</Link>
	);
}
