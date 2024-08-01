import React from "react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/NavBar";
import useGetFencers from "../../../../data/useGetFencers";
import getServerSideEventData from "../../../../data/getServerSideEventData";
import Metadata from "../../../../components/Metadata";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../firebase/firebase.js";
import {
	setDoc,
	doc,
	collection,
	query,
	where,
	getDocs,
	getDoc,
	deleteDoc,
	addDoc,
} from "firebase/firestore";
import ParticipantCard from "../../../../components/ParticipantCard";

const Participants = ({ eventData }) => {
	const router = useRouter();
	//const { event } = router.query;
	//const routerIsReady = router.isReady;

	const fencers = useGetFencers(eventData.id);
	console.log(eventData, fencers);

	const [user] = useAuthState(auth);
	const userIsJoined =
		user && fencers.some(fencer => fencer.userId === user.uid);

	console.log("eventId", eventData.id);
	const eventRef = doc(db, "Events", eventData.id);

	const dataIsLoaded = !!fencers;

	const joinAs = async fencerToJoinAs => {
		// update fencer information
		const fencerToJoinAsRef = doc(eventRef, "fencers", fencerToJoinAs.id);
		console.log("User id: ");
		console.log(user.uid);
		const boutsRef = collection(eventRef, "bouts");
		const fencerABoutsQuery = query(
			boutsRef,
			where("fencerAUserName", "==", fencerToJoinAs.userName)
		);
		const fencerBBoutsQuery = query(
			boutsRef,
			where("fencerBUserName", "==", fencerToJoinAs.userName)
		);
		const fencerABoutsSnapshot = await getDocs(fencerABoutsQuery);
		fencerABoutsSnapshot.forEach(async boutDoc => {
			const boutRef = doc(boutsRef, boutDoc.id);
			await setDoc(
				boutRef,
				{
					fencerAUserName: user.displayName,
				},
				{ merge: true }
			);
		});
		const fencerBBoutsSnapshot = await getDocs(fencerBBoutsQuery);
		fencerBBoutsSnapshot.forEach(async boutDoc => {
			const boutRef = doc(boutsRef, boutDoc.id);
			await setDoc(
				boutRef,
				{
					fencerBUserName: user.displayName,
				},
				{ merge: true }
			);
		});

		await setDoc(
			fencerToJoinAsRef,
			{
				userName: user.displayName,
				userId: user.uid,
				isJoined: true,
			},
			{ merge: true }
		);
		// update users in the event
		if (!eventData.users.includes(user.uid)) {
			await setDoc(
				eventRef,
				{
					users: [...eventData.users, user.uid],
				},
				{ merge: true }
			);
		}
	};

	return (
		<>
			<Metadata
				title={`${eventData.name}: participants`}
				url={`/event/${eventData.id}/participants`}
			/>
			<NavBar
				eventName={eventData.name}
				eventId={eventData.id}
				currentTab="participants"
			/>
			{dataIsLoaded && (
				<div className="mainContent">
					<h3>Participants</h3>
					{user && !userIsJoined && (
						<p>
							Click the &quot;Join as&quot; button to join the
							event as the corresponding fencer.
						</p>
					)}
					<ol className="card column">
						{fencers
							.sort(
								(fencerA, fencerB) =>
									fencerA.startingRank - fencerB.startingRank
							)
							.map((fencer, index) => (
								<li key={index} className="participant-in-list">
									<ParticipantCard
										fencerUserName={fencer.userName}
										number={index + 1}
									/>
									{user &&
										!userIsJoined &&
										!fencer.isJoined && (
											<button
												className="button button-secondary"
												onClick={() => joinAs(fencer)}
											>
												Join as
											</button>
										)}
								</li>
							))}
					</ol>
				</div>
			)}
		</>
	);
};

export default Participants;

export async function getServerSideProps({ params }) {
	// Fetch data from external API
	const eventData = await getServerSideEventData(params.event);
	return { props: { eventData } };
}
