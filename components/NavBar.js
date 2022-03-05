import React, {useState} from 'react';
import styles from '../styles/NavBar.module.css'
import {NavLinks} from './NavLinks'

export const NavBar = (props) => {
    const [open, setOpen] = useState(false)
    return (
        <nav className={styles.nav}>
            <div className={styles.navBar}>
                <h1>Instant Fencing</h1>
                <div className={styles.menuIcon + ' ' + (open ? styles.menuIcon_open : styles.menuIcon_closed)} onClick={() => {
                    console.log('opening')
                    setOpen(!open)}}>
                    <div className={styles.menuBar + ' ' + (open ? styles.menuBar1_closed : '')}></div>
                    <div className={styles.menuBar + ' ' + (open ? styles.menuBar2_closed : '')}></div>
                    <div className={styles.menuBar + ' ' + (open ? styles.menuBar3_closed : '')}></div>
                </div>
            </div> 
            {
                props.eventName ?
                <h2>{props.eventName}</h2>
                : null
            } 
            <NavLinks open={open} />
        </nav>
    )
}

//` menuIcon menuIcon_${menuState}`
