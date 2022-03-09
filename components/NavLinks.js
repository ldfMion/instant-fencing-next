import React from 'react';

import styles from '../styles/NavLinks.module.css';

import {SignOut} from './SignOut.js'

import Link from 'next/link'

export const NavLinks = (props) => {
    return (
        <div className={styles.NavLinks + ' ' + (props.open ? styles.NavLinks_open : styles.NavLinks_closed)}>
            <Link href='/home'><button className='button-terciary'>Home</button></Link>
            <Link href='about'><button className='button-terciary'>About</button></Link>
            <SignOut/>
        </div>
    );
}

