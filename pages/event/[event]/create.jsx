import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
//import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase/firebase.js";

import NavBar from "../../../components/NavBar";
import { WaitingRoom } from "../../../components/WaitingRoom.jsx";
import { SelectSortType } from "../../../components/SelectSortType.jsx";
import { SortByRank } from "../../../components/SortByRank.jsx";
import { SetPools } from "../../../components/SetPools.jsx";

import getServerSideEventData from "../../../data/getServerSideEventData";
import useGetEventData from "../../../data/useGetEventData";

const Create = ({ serverSideEventData }) => {
	const router = useRouter();
	console.log("from server side", serverSideEventData);
	console.log("create page");

	const [user] = useAuthState(auth);

	const eventRef = doc(db, "Events", serverSideEventData.id);

	const eventData = useGetEventData(serverSideEventData.id)

	console.log("eventRef", eventRef);

	const description = `You are invited to participate in the ${serverSideEventData.name} fencing event with Instant Fencing.`;

	const metaTags = (
		<Head>
			<title>{serverSideEventData.name}</title>
			<meta name="description" content={description} />
			<meta
				name="viewport"
				content="initial-scale=1.0, width=device-width"
			/>
			<meta name="robots" content="index, follow" />
			<meta charset="UTF-8" />

			<meta property="og:title" content={serverSideEventData.name} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content="website" />
		</Head>
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
