import React from 'react';

import styles from '../styles/NavLinks.module.css';

import {SignOut} from './SignOut.js'

import Link from 'next/link'

export const NavLinks = (props) => {
    return (
        <menu className={styles.NavLinks + ' ' + (props.open ? styles.NavLinks_open : styles.NavLinks_closed)}>
            <Link href='/home'><a className='button-terciary'>Home</a></Link>
            <Link href='about'><a className='button-terciary'>About</a></Link>
            <SignOut/>
        </menu>
    );
}

