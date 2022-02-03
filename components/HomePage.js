import React, {useState, useEffect} from 'react';

//import { collection, addDoc } from "firebase/firestore"; 
import { collection, query, where, getDocs} from "firebase/firestore";

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
            console.log(doc.id, " => ", doc.data());
            eventsDataArray.push(doc.data());
        });
        setEvents(eventsDataArray);
        console.log('events data array', eventsDataArray)

    }, [])
    console.log('events', events)

    return (<div className='mainContent'>
        <h2>Home Page</h2>
        <h3>My Events</h3>
        <ul className='card'>
            {newEvent && <CreateEvent createEvent={createEvent}/>}
            {events.length != 0 ? 
            events.map((event, index) => {
                const date = event.createdAt ? event.createdAt.toDate() : null;
                return <a href={`./competition/${event.id}/`} key={index}>
                    <li key={index}>
                        <p>{event.name}</p>
                        <p>{date ? `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`: null}</p>
                    
                    </li>
                </a>
            }) :
            <p>Create your first event</p>
            }
        </ul>
    </div>)

    /*
    return (<div className='mainContent'>
        <h2>Home Page</h2>
        <h3>My Events</h3>
        <ul className='card'>
            {newEvent && <CreateEvent createEvent={createEvent}/>}
            {events ? 
            {events.map((event, index) => {
                const date = event.createdAt ? event.createdAt.toDate() : null;
                return <a href={`./competition/${event.id}/`} >
                    <li key={index}>
                        <p>{event.name}</p>
                        <p>{date ? `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`: null}</p>
                    
                    </li>
                </a>
            }) :
            <p>Create your first event</p>
            }
        </ul>
    </div>)
    */
}
