import React from 'react'

import Link from 'next/link'

import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

import {auth} from '../firebase/firebase.js'

export function SignOut() {
    const [user] = useAuthState(auth);
    return (<>
        {user ? 
            <button className='button-primary' onClick={() => signOut(auth)}>Sign Out</button> :
            <Link passHref href='/home'><button className='button-primary'>Log In or Create an Account</button></Link>
        }
    </>)
}
