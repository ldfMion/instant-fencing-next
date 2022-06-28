import React,{useState} from 'react'

import styles from '../styles/LogPrompt.module.css'

import {Login} from './Login.js'
import SignUp from './SignUp'

export function LogPrompt() {
    const [choice, setChoice] = useState('')

    return (
        <div className={styles.popupBackground}>
            <div className='card column'>
                {choice === '' && <>
                    <h2>Login or Create an Account</h2>
                    <button onClick={() => setChoice('login')} className='button-primary'>Log In</button>
                    <button onClick={() => setChoice('signup')} className='button-secondary'>Sign Up</button>
                </>}
                {choice === 'login' && <>
                    <Login/>

                </>}
                {choice === 'signup' && <>
                    <SignUp/>
                </>}

            </div>
        </div>
    )

}
