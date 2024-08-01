import React from "react";
import { useEffect, useState } from "react";

import {
	collection,
	addDoc,
	onSnapshot,
	deleteDoc,
	setDoc,
	doc,
} from "firebase/firestore";

import { AddFencer } from "./AddFencer.jsx";
import LoginButton from "./LoginButton.jsx";

const FENCER_LIMIT = 40;

export function WaitingRoom({ users, eventRef, user }) {
	const [fencers, setFencers] = useState([]);
	const fencersRef = collection(eventRef, "fencers");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const getFencers = onSnapshot(fencersRef, snapshot => {
			const fencers = [];
			snapshot.forEach(doc => {
				const id = doc.id;
				fencers.push({ ...doc.data(), id });
			});
			setFencers(fencers);
		});
		return getFencers;
	}, []); //[fencersRef, user]);

	const userIsJoined = fencers.some(fencer => fencer.userId === user.uid);

	const join = async () => {
		await addDoc(fencersRef, {
			userName: user.displayName,
			isJoined: true,
			userId: user.uid,
		});
		if (!users.includes(user.uid)) {
			await setDoc(
				eventRef,
				{
					users: [...users, user.uid],
				},
				{ merge: true }
			);
		}
	};

	const leave = async () => {
		const userFencer = fencers.filter(
			fencer => fencer.userId === user.uid
		)[0];
		await deleteDoc(doc(fencersRef, userFencer.id));
	};

	const addFencer = async fencerUserName => {
		const fencerRef = await addDoc(fencersRef, {
			userName: fencerUserName,
		});
	};

	const removeFencer = async id => {
		await deleteDoc(doc(fencersRef, id));
	};

	const joinAs = async fencerId => {
		const fencerRef = doc(eventRef, "fencers", fencerId);
		await setDoc(
			fencerRef,
			{
				userName: user.displayName,
				userId: user.uid,
				isJoined: true,
			},
			{ merge: true }
		);
		if (!users.includes(user.uid)) {
			await setDoc(
				eventRef,
				{
					users: [...users, user.uid],
				},
				{ merge: true }
			);
		}
	};

	const createEvent = async () => {
		await setDoc(
			eventRef,
			{
				fencersAreChosen: true,
			},
			{ merge: true }
		);
	};

	if (!fencers) {
		return null;
	}
	return (
		<>
			<div className="mainContent">
				<h3>Waiting Room</h3>
				<div className="card horizontal-form column">
					<p className="wrap-anywhere">{window.location.href}</p>
					<button
						className="button button-secondary"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							setCopied(true);
						}}
					>
						{copied ? "Copied!" : "Copy"}
					</button>
				</div>
				{user ? (
					<AddFencer
						addFencer={addFencer}
						fencerLimitReached={fencers.length >= FENCER_LIMIT}
					/>
				) : (
					<p>Log in to add fencers</p>
				)}
				<p>Number of fencers limited to {FENCER_LIMIT}.</p>
				<p>Number of fencers has to be at least 3.</p>
				{fencers.length !== 0 ? (
					<ul className="card column">
						{fencers.map((fencer, index) => (
							<li key={index} className="participant-in-list">
								<p>{fencer.userName}</p>
								{user &&
									(fencer.userId === user.uid ? (
										<button
											className="button button-secondary"
											onClick={leave}
										>
											Leave
										</button>
									) : (
										<div>
											{!userIsJoined &&
												!fencer.isJoined && (
													<button
														className="button button-terciary"
														onClick={() =>
															joinAs(fencer.id)
														}
													>
														Join as
													</button>
												)}
											<button
												className="button button-terciary"
												onClick={() =>
													removeFencer(fencer.id)
												}
											>
												Remove
											</button>
										</div>
									))}
							</li>
						))}
					</ul>
				) : (
					<p>Join or add fencers</p>
				)}
			</div>
			<div className="button-container">
				{!user && <LoginButton showSignOut={false} />}
				{user && (
					<button
						className={`button button-${
							userIsJoined ? "primary" : "secondary"
						}`}
						onClick={createEvent}
						disabled={fencers.length < 3}
					>
						Done
					</button>
				)}
				{!userIsJoined && user && (
					<button className="button button-primary" onClick={join}>
						Join
					</button>
				)}
			</div>
		</>
	);
}
