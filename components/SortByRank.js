import React, { useState, useEffect } from "react";

import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";

export function SortByRank(props) {
	const [unselectedFencers, setUnselectedFencers] = useState([]);
	const [selectedFencers, setSelectedFencers] = useState([]);
	const fencersRef = collection(props.eventRef, "fencers");
	useEffect(async () => {
		console.log("is on use effect");
		const getFencers = onSnapshot(fencersRef, snapshot => {
			const fencers = [];
			snapshot.forEach(doc => {
				const id = doc.id;
				fencers.push({ ...doc.data(), id });
			});
			console.log(fencers);
			setUnselectedFencers(fencers);
		});
	}, []);

	const addFencer = async fencerToAdd => {
		setSelectedFencers([...selectedFencers, fencerToAdd]);
		setUnselectedFencers(
			unselectedFencers.filter(fencer => fencer !== fencerToAdd)
		);
	};
	const removeFencer = async fencerToRemove => {
		setUnselectedFencers([...unselectedFencers, fencerToRemove]);
		setSelectedFencers(
			selectedFencers.filter(fencer => fencer !== fencerToRemove)
		);
	};
	const handleSubmit = async e => {
		console.log("submitting");
		e.preventDefault();
		await setDoc(
			props.eventRef,
			{
				fencersAreSorted: true,
			},
			{ merge: true }
		);
		selectedFencers.forEach(async (fencer, index) => {
			await setDoc(
				doc(fencersRef, fencer.id),
				{
					startingRank: index + 1,
				},
				{ merge: true }
			);
		});
	};
	console.log(selectedFencers);
	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="mainContent">
					<h3>Sort By Rank</h3>
					{props.user && (
						<p>
							Select Fencers from best to worst. This rank will be
							used to arrage them in pools.
						</p>
					)}
					{!props.user && (
						<p className="fail-text">Log in to continue creating the event</p>
					)}
					<ol className="card column">
						{selectedFencers.map((fencer, index) => (
							<li key={index} className="participant-in-list">
								<p>{index + 1}</p>
								<label htmlFor={fencer.userName}>
									{fencer.userName}
								</label>
								{props.user && (
									<input
										type="checkbox"
										id={fencer.userName}
										checked={true}
										name={fencer.userName}
										value={fencer.userName}
										onChange={() => removeFencer(fencer)}
									/>
								)}
							</li>
						))}
					</ol>
					<ul className="card column">
						{unselectedFencers.map((fencer, index) => (
							<li key={index} className="participant-in-list">
								<label htmlFor={fencer.userName}>
									{fencer.userName}
								</label>
								{props.user && (
									<input
										type="checkbox"
										id={fencer.userName}
										name={fencer.userName}
										value={fencer.userName}
										checked={false}
										onChange={() => addFencer(fencer)}
									/>
								)}
							</li>
						))}
					</ul>
				</div>
				{props.user && (
					<div className="button-container">
						<button
							className="button-primary"
							type="submit"
							disabled={unselectedFencers.length !== 0}
						>
							Confirm
						</button>
					</div>
				)}
			</form>
		</>
	);
}
