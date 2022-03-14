import React from 'react'
import {useRouter} from 'next/router'

export default function Pools() {
    const router = useRouter();
    const {event} = router.query
    console.log(event)
    return (
        <div>Pools</div>
    )
}
