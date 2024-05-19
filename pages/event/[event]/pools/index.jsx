import React from "react";

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
            <Metadata title={`${serverSideEventData.name}: pools - Instant Fencing`} url={`/event${serverSideEventData.id}/pools`}/>
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
                        return <PoolPreview poolData={pool} key={pool.id} eventId={serverSideEventData.id}/>
                    })}
                </ol>
                <div className="card column">
                    <p><span className="success-text bold">V</span>: victories</p>
                    <p><span className="fail-text bold">D</span>: defeats</p>
                    <p><span className="bold">M</span>: missing bouts</p>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
	const serverSideEventData = await getServerSideEventData(params.event);
	return { props: { serverSideEventData } };
}