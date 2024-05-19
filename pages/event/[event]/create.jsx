import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
//import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase/firebase.js";

import Metadata from "../../../components/Metadata.jsx";
import NavBar from "../../../components/NavBar";
import { WaitingRoom } from "../../../components/WaitingRoom.jsx";
import { SelectSortType } from "../../../components/SelectSortType.jsx";
import { SortByRank } from "../../../components/SortByRank.jsx";
import { SetPools } from "../../../components/SetPools.jsx";

import getServerSideEventData from "../../../data/getServerSideEventData";
import useGetEventData from "../../../data/useGetEventData";

const Create = ({ serverSideEventData }) => {
	const router = useRouter();

	const [user] = useAuthState(auth);

	const eventRef = doc(db, "Events", serverSideEventData.id);

	const eventData = useGetEventData(serverSideEventData.id)

	console.log("eventRef", eventRef);

	const description = `You are invited to participate in the ${serverSideEventData.name} fencing event with Instant Fencing.`;

	const metaTags = (
		<Metadata title={serverSideEventData.name} url={`/event/${serverSideEventData.id}/create`}/>
	);

	if (!eventData) {
		return (
			<>
				<>{metaTags}</>
				<NavBar />
			</>
		);
	}

	if (!eventData.fencersAreChosen) {
		return (
			<>
				{metaTags}
				<NavBar eventName={serverSideEventData.name} />
				<WaitingRoom
					users={serverSideEventData.users}
					eventRef={eventRef}
					user={user}
				/>
			</>
		);
	}
	console.log("eventRef", eventRef);
	console.log(serverSideEventData.sortType);
	if (!eventData.sortType) {
		return (
			<>
				{metaTags}
				<NavBar eventName={serverSideEventData.name} />
				<SelectSortType eventRef={eventRef} user={user} />
			</>
		);
	}
	if (
		!eventData.fencersAreSorted &&
		eventData.sortType === "By Rank"
	) {
		return (
			<>
				{metaTags}
				<NavBar eventName={serverSideEventData.name} />
				<SortByRank eventRef={eventRef} user={user} />
			</>
		);
	}
	if (!eventData.poolsAreSet) {
		return (
			<>
				{metaTags}
				<NavBar eventName={serverSideEventData.name} />
				<SetPools eventRef={eventRef} user={user} />
			</>
		);
	}
	router.push(`/event/${serverSideEventData.id}/pools`);
	return null;
};

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	if (serverSideEventData.poolsAreSet) {
		return {
			redirect: {
				permanent: false,
				destination: `/event/${serverSideEventData.id}/pools`,
			},
		};
	}
	return { props: { serverSideEventData } };
}

export default Create;
