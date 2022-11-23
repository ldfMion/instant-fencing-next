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
import { LogPrompt } from "./LogPrompt.jsx";

export function WaitingRoom({users, eventRef, user}) {
	const [fencers, setFencers] = useState(false);

	const fencersRef = collection(eventRef, "fencers");

	const [logPrompt, setLogPrompt] = useState(false);

	const [userIsJoined, setUserIsJoined] = useState(false);

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const getFencers = onSnapshot(fencersRef, snapshot => {
			const fencers = [];
			snapshot.forEach(doc => {
				const id = doc.id;
				fencers.push({ ...doc.data(), id });
			});
			setFencers(fencers);
			if (user) {
				setUserIsJoined(
					fencers.some(fencer => fencer.id === user.uid)
				);
			}
		});
	}, [fencersRef, user]);

	const join = async () => {
		const fencerRef = await setDoc(
			doc(eventRef, "fencers", user.uid),
			{
				userName: user.displayName,
				id: user.uid,
                isJoined: true,
			}
		);
        if(!users.includes(user.uid)){
            await setDoc(eventRef, {
                users: [...users, user.uid],
            }, {merge: true})
        }
	};

	const leave = async () => {
		await deleteDoc(doc(fencersRef, user.uid));
	};

	const addFencer = async fencer => {
		const fencerRef = await addDoc(collection(eventRef, "fencers"), {
			userName: fencer,
		});
	};

	const removeFencer = async id => {
		await deleteDoc(doc(fencersRef, id));
	};

	const thisIsMe = async id => {
		removeFencer(id);
		join();
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
					<AddFencer addFencer={addFencer} />
				) : (
					<p>Log in to add fencers</p>
				)}
				{fencers.length !== 0 ? (
					<ul className="card column">
						{fencers.map((fencer, index) => (
							<li key={index} className="participant-in-list">
								<p>{fencer.userName}</p>
								{user &&
									(fencer.id === user.uid ? (
										<button
											className="button button-secondary"
											onClick={leave}
										>
											Leave
										</button>
									) : (
										<div>
											{!userIsJoined && !fencer.isJoined && (
												<button
													className="button button-terciary"
													onClick={() =>
														thisIsMe(fencer.id)
													}
												>
													This is me
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
				{!user && (
					<button
						onClick={() => {
							setLogPrompt(true);
						}}
						className="button button-primary"
					>
						{" "}
						Log In to join and add participants
					</button>
				)}
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
			{logPrompt && !user && <LogPrompt />}
		</>
	);
}
