import React from 'react'

import {auth} from '../firebase/firebase.js'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
//import {setDoc, doc} from 'firebase/firestore'


const SignUp = () => {

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        /*
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        */
    }

    return (
        <>
            <h2>Create an Account</h2>
            <button className='button-primary' onClick={signInWithGoogle}>Sign Up with Google</button>
        </>
    );
}

export default SignUp;