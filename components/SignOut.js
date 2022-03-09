import React from 'react'

import Link from 'next/link'

import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

export function SignOut() {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    return (<>
        {user ? 
            <button className='button-primary' onClick={() => signOut(auth)}>Sign Out</button> :
            <Link href='/home'><button className='button-primary'>Log In or Create an Account</button></Link>
        }
    </>)
}
