import React from 'react'

import Link from 'next/link'

import styles from '../styles/LogPrompt.module.css'

export function LogPrompt() {
    return (
        <div className={styles.popupBackground}>
            <div className='card'>
                <h1>Log In or Sign Up</h1>
                <Link target='_blank' href='/login'><button className='button-primary'>Log In</button></Link>
                <Link href='/signup'><button className='button-secondary'>Sign Up</button></Link>
            </div>
        </div>
    )
}
