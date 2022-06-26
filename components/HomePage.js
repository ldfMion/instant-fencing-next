import React, {useState, useEffect} from 'react';

import {CreateEvent} from './CreateEvent'
import NavBar from './NavBar'

import { collection, query, where, getDocs, addDoc} from "firebase/firestore";

import {useRouter} from 'next/router'

export const HomePage = (props) => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState(false)
    console.log(props)

    useEffect(async () => {

        const eventsRef = query(collection(props.db, 'Events'), where("users", "array-contains", props.user.uid))

        const eventsData = await getDocs(eventsRef);
        const eventsDataArray = [];
        eventsData.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const id = doc.id
            console.log(doc.id, " => ", doc.data());
            eventsDataArray.push({...doc.data(), id});
        });
        setEvents(eventsDataArray);
        console.log('events data array', eventsDataArray)

    }, [])

    const router = useRouter();

    const createEvent = async (name, type) => {
        console.log('is on create new event')
        setNewEvent(false);
        try{
            console.log('is on try')
            const eventRef = await addDoc(collection(props.db, 'Events'), {
                name: name,
                users: [props.user.uid],
                createdBy: props.user.uid,
                createdAt: new Date(),
                type: type,
                fencers: []
            });

            router.push(`/event/${eventRef.id}/create`)
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    return (
        <>
            <NavBar
                eventName={'Home Page'}
            />
            <div className='mainContent'>
                <h3>My Events</h3>
                <ul className='card column'>
                    {newEvent && <CreateEvent createEvent={createEvent}/>}
                    {events.length != 0 ? 
                    events.sort((eventA, eventB) => eventB.createdAt.seconds - eventA.createdAt.seconds).map((event, index) => {
                        const date = event.createdAt ? event.createdAt.toDate() : null;
                        return <a href={`./event/${event.id}/create`} key={index}>
                            <li key={index} className="participant-in-list">
                                <p>{event.name}</p>
                                <p>{date ? `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`: null}</p>
                            
                            </li>
                        </a>
                    }) :
                    <p>Create your first event</p>
                    }
                </ul>
            </div>
            <div className='button-container'>
                {!newEvent ? <button className='button button-primary' onClick={() => setNewEvent(true)}>Create Event</button> : <button className='button button-secondary' onClick={() => setNewEvent(false)}>Cancel</button>}
            </div>
        </>
    )
}
