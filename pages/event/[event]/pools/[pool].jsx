import React from "react";
import Head from "next/head";

//import { useAuthState } from 'react-firebase-hooks/auth';

import Metadata from "../../../../components/Metadata"
import { PoolTable } from "../../../../components/PoolTable.jsx";
import { PoolBouts } from "../../../../components/PoolBouts.jsx";
import NavBar from "../../../../components/NavBar";

import getServerSideEventData from "../../../../data/getServerSideEventData.js";
import getServerSidePoolData from "../../../../data/getServerSidePoolData.js";
import useGetPoolBouts from "../../../../data/useGetPoolBouts.js"
import useGetPoolFencers from "../../../../data/useGetPoolFencers.js"

export default function Pool({ serverSideEventData, serverSidePoolData }) {

    const fencers = useGetPoolFencers(serverSideEventData.id, serverSidePoolData.id);
    console.log(fencers)
    const bouts = useGetPoolBouts(serverSideEventData.id, serverSidePoolData.poolId);
    console.log(bouts)

	const isLoaded = fencers && bouts;

	// pool table and bouts are separeted into their own pages
	// data is fetched only once (on [pool].js), as table and bouts use the same data

	return (
		<>
            <Metadata title={`${serverSideEventData.name}: Pool ${serverSidePoolData.poolId}`}/>
			<NavBar
				currentTab={"pools"}
				eventName={serverSideEventData.name}
				eventId={serverSideEventData.id}
			/>
			<div className="mainContent">
				<h3> Pool {serverSidePoolData.poolId}</h3>
				{isLoaded && (
					<>
						<PoolTable fencers={fencers} bouts={bouts} />
						<PoolBouts fencers={fencers} bouts={bouts} />
					</>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	const serverSidePoolData = await getServerSidePoolData(
		params.event,
		params.pool
	);
	return { props: { serverSideEventData, serverSidePoolData } };
}