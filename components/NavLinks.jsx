import React from 'react';

import styles from '../styles/NavLinks.module.css';

import {SignOut} from './SignOut.jsx'

import Link from 'next/link'

export const NavLinks = (props) => {
    return (
        <menu className={styles.NavLinks + ' ' + (props.open ? styles.NavLinks_open : styles.NavLinks_closed)}>
            <Link href='/home' passHref><button className='button-terciary'><a>Home</a></button></Link>
            <Link href='/' passHref><button className='button-terciary'><a>About</a></button></Link>
            <SignOut/>
        </menu>
    );
}

