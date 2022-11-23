import React, { useEffect, useState } from "react";

import {
	addDoc,
	collection,
	onSnapshot,
	setDoc,
	doc,
} from "firebase/firestore";

import boutOrder from "../resources/boutOrder";

export function SetPools(props) {
	console.log(props.eventRef);
	const fencersRef = collection(props.eventRef, "fencers");
	const boutsRef = collection(props.eventRef, "bouts");
	const [pools, setPools] = useState([]);
	useEffect(() => {
		// get the fencers from the database
		console.log("is on the first use effect");
		const getFencers = onSnapshot(fencersRef, snapshot => {
			let fencers = [];
			snapshot.forEach(doc => {
				const id = doc.id;
				fencers.push({ ...doc.data(), id });
			});
			if (fencers[0]?.startingRank == undefined) {
				fencers = shuffle(fencers);
			} else {
				console.log("is on else");
				fencers.sort(
					(fencerA, fencerB) =>
						fencerA.startingRank - fencerB.startingRank
				);
			}
			console.log(fencers);
			//setFencers(fencers)
			// setting the pools
			console.log(fencers);
			const numPools = defineNumPools(fencers.length);
			console.log("numPools", numPools);

			const maxNumFencersInPool = Math.ceil(fencers.length / numPools);
			console.log("maxNumFencersInPool", maxNumFencersInPool);
			const rows = [];
			for (let i = 0; i < maxNumFencersInPool; i++) {
				const row = [];
				row[numPools - 1] = undefined;
				for (let t = 0; t < row.length; t++) {
					row[t] = undefined;
				}
				rows.push(row);
			}

			let fencerCounter = 0;
			rows.forEach(row =>
				row.forEach((slot, index, array) => {
					array[index] = fencers[fencerCounter];
					fencerCounter++;
				})
			);

			rows.forEach((row, index) => {
				if (index % 2 === 1) {
					row.reverse();
				}
			});
			console.log(rows);
			rows[rows.length - 1] = rows[rows.length - 1].filter(
				row => row !== undefined
			);

			const pools = [];
			for (let i = 0; i < numPools; i++) {
				pools[i] = [];
			}
			for (let i = 0; i < numPools; i++) {
				for (let t = 0; t < rows.length; t++) {
					pools[i][t] = rows[t][i];
				}
			}
			pools.forEach(pool => {
				if (pool[pool.length - 1] === undefined) {
					pool.pop();
				}
			});
			console.log(pools);
			setPools(pools);
		});
	}, []);

	const handleSubmit = async e => {
		e.preventDefault();
		console.log("is submitting");
		pools.forEach(async (pool, poolIndex) => {
			try {
				// pool has at least 2 fencers, so index 0 has bouts for 2 fencers
				boutOrder[pool.length - 2].forEach((bout, boutIndex) => {
					console.log(pool);
					console.log(bout);
					setDoc(doc(boutsRef), {
						fencerAId: pool[bout[0] - 1].id,
						fencerBId: pool[bout[1] - 1].id,
						fencerAUserName: pool[bout[0] - 1].userName,
						fencerBUserName: pool[bout[1] - 1].userName,
						fencerAScore: 0,
						fencerBScore: 0,
						poolNumber: poolIndex + 1,
						boutNumber: boutIndex + 1,
						fencerANumber: bout[0],
						fencerBNumber: bout[1],
					});
				});
			} catch (err) {
				throw new Error(err);
			}
			const poolRef = await addDoc(collection(props.eventRef, "pools"), {
				poolId: poolIndex + 1,
				fencers: pool.map(fencer => {
					return fencer.id;
				}),
			});
			pool.forEach(fencer => {
				console.log([poolRef.id]);
				setDoc(
					doc(fencersRef, fencer.id),
					{ pool: poolRef.id },
					{ merge: true }
				);
			});
		});
		//return
		await setDoc(
			props.eventRef,
			{
				poolsAreSet: true,
			},
			{ merge: true }
		);
	};

	return (
		<>
			<div className="mainContent">
				<h3>Pools:</h3>
				<ol className="columnfuse">
					{pools.map((pool, index) => {
						return (
							<li id={index} key={index} className="column">
								<h4>Pool {index + 1}</h4>
								<ol className="card column">
									{pool.map((fencer, index) => {
										return (
											<li
												id={index}
												className="participant-in-list"
												key={index}
											>
												<p className="bold">{index + 1}</p>
												<p className="left-align">{fencer.userName}</p>
												<p>{fencer.startingRank}</p>
											</li>
										);
									})}
								</ol>
							</li>
						);
					})}
				</ol>
			</div>
			<form onSubmit={handleSubmit} className="button-container">
				<button
					className="button-primary"
					type="submit"
				>
					Confirm
				</button>
			</form>
		</>
	);
}

function defineNumPools(numParticipants) {
	let numPools;
	if (numParticipants % 7 !== 0) {
		numPools = Math.floor(numParticipants / 6);
	}

	if (numParticipants % 6 <= 5) {
		numPools = Math.floor(numParticipants / 5);
	}
	if (numParticipants % 7 === 0) {
		numPools = numParticipants / 7;
	}
	if (numParticipants <= 10) {
		numPools = 1;
	}

	console.log("numPools", numPools);
	return numPools;
}

function shuffle(array) {
	var currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
