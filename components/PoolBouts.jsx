import React from "react";
import styles from "../styles/PoolBouts.module.css";
import BoutSide from "./BoutSide";

export function PoolBouts({ fencers, bouts, user }) {
	console.log("in pool bouts");
	console.log(bouts);
	console.log(fencers);

	const keyFencers = {};
	fencers.forEach(fencer => {
		keyFencers[fencer.id] = fencer;
	});

	const userFencerId = user
		? fencers.filter(fencer => fencer.userId === user.uid)[0]
		: undefined;

	return (
		<>
			<h4>Bouts</h4>
			<ol className={styles.bouts}>
				{bouts
					.sort((prev, curr) => {
						return prev.boutNumber - curr.boutNumber;
					})
					.map((bout, index) => {
						return (
							<li key={bout.id} className={styles.bout}>
								<p>{bout.boutNumber}</p>
								<div
									className={
										"card" + " " + styles.boutContainer
									}
								>
									<BoutSide
										fencer={keyFencers[bout.fencerAId]}
										fencerNumber={bout.fencerANumber}
										fencerScore={bout.fencerAScore}
										updateScore={bout.updateScoreA}
										disabled={!user}
										bold={bout.fencerAId === userFencerId}
									/>
									<BoutSide
										fencer={keyFencers[bout.fencerBId]}
										fencerNumber={bout.fencerBNumber}
										fencerScore={bout.fencerBScore}
										updateScore={bout.updateScoreB}
										disabled={!user}
										bold={bout.fencerBId === userFencerId}
									/>
								</div>
							</li>
						);
					})}
			</ol>
		</>
	);
}
