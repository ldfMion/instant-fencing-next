import React,{useState} from 'react'

import styles from '../styles/LogPrompt.module.css'

import {Login} from './Login.js'

export function LogPrompt() {
    const [choice, setChoice] = useState('')

    return (
        <div className={styles.popupBackground}>
            <div className='card'>
                {choice === '' && <>
                    <h2>Login or Create an Account</h2>
                    <button onClick={() => setChoice('login')} className='button-primary'>Log In</button>
                    <button onClick={() => setChoice('signup')} className='button-secondary'>Sign Up</button>
                </>}
                {choice === 'login' && <>
                    <Login/>

                </>}
                {choice === 'signup' && <>
                    <h1>Create an Account</h1>
                </>}

            </div>
        </div>
    )

}
