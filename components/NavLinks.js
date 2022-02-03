import React from 'react';
import styles from '../styles/NavLinks.module.css';

export const NavLinks = (props) => {
    return (
        <div className={styles.NavLinks + ' ' + (props.open ? styles.NavLinks_open : styles.NavLinks_closed)}>
            <button className='button-terciary'>Home</button>
            <button className='button-terciary'>About</button>
            <button className='button-primary'>
                <p>Sign Out</p>
            </button>
        </div>
    );
}

