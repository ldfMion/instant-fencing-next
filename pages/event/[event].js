import React from 'react';
import {useRouter} from 'next/router'

const Event = () => {
    console.log('is in event')
    const router = useRouter();
    const {event} = router.query
    return (
        <p>{event}</p>
    );
}

export default Event;