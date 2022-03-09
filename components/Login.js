import React, {useState} from 'react'

import {auth} from '../firebase/firebase.js'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export const Login = () => {

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    return (
        <div>
            <h2>Log In</h2>
            <button className='button-primary' onClick={signInWithGoogle}>Log In With Google</button>
        </div>
    );
}