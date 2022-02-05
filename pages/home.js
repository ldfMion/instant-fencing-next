import React, {useState, useEffect} from 'react';

import { getAuth } from "firebase/auth";

import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionDataOnce} from 'react-firebase-hooks/firestore';

import {HomePage} from '../components/HomePage';
import {NavBar} from '../components/NavBar';

import Link from 'next/link'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}


export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const Home = () => {
    console.log('is rendering the coponent again')
    //get the user that is logged in
    const auth = getAuth();
    const [user] = useAuthState(auth);
    console.log(user)
    
    //load the prompt to sign in/up if the user is not signed in
    
    if(!user){
        return (<div>
            <h1>Log In or Sign Up</h1>
            <Link href='login'><button className='button-primary'>Log In</button></Link>
            <Link href='signup'><button className='button-secondary'>Sign Up</button></Link>
        </div>)
    }
    //render the home page if the user is signed in
    /*
    return (
        <div>
            <NavBar />
            <HomePage user={user} db={db}/>
        </div>
    );*/
    return (
        <div>
            <HomePage user={user} db={db}/>
        </div>
    )
    
}

export default Home;
