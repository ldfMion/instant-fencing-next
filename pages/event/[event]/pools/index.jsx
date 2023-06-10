import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Metadata from "../../../../components/Metadata";
import NavBar from "../../../../components/NavBar";
import {PoolPreview} from '../../../../components/PoolPreview'

import useGetPools from "../../../../data/useGetPools";
import getServerSideEventData from "../../../../data/getServerSideEventData";

export default function Pools({serverSideEventData}) {

    const pools = useGetPools(serverSideEventData.id)

    //const dataIsLoaded = !!pools;
    console.log(pools)
    return (
        <>
            <Metadata title={`${serverSideEventData.name}: pools - Instant Fencing`}/>
            <NavBar
                tabs={true}
                eventId={serverSideEventData.id}
                eventName={serverSideEventData.name}
                currentTab={'pools'}
            />
            <div className='mainContent'>
                <h3>Pools</h3>
                <ol className="column">
                    {pools.map(pool => {
                        console.log('is on map')
                        return <PoolPreview poolData={pool} eventRef={eventRef} key={pool.id} eventId={serverSideEventData.id}/>
                    })}
                </ol>
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	return { props: { serverSideEventData } };
}