import React, {useState} from 'react';
import styles from '../styles/NavBar.module.css'
import {NavLinks} from './NavLinks'
import Link from 'next/link'

const NavBar = ({eventName, eventId, currentTab}) => {
    const [open, setOpen] = useState(false)
    
    const tabs = [
         "participants",
        'pools',
        'pool-results',
        //'direct-elimination',
        //'results',
    ]

    const baseURL = `/event/${eventId}/`

    return (
        <nav className={`${styles.nav}`}>
            <div className={styles.navBar}>
                <div className={styles.titleAndMenu}>
                    <h1>Instant Fencing</h1>
                    <div className={styles.menuIcon + ' ' + (open ? styles.menuIcon_open : styles.menuIcon_closed)} onClick={() => {
                        setOpen(!open)}}>
                        <div className={styles.menuBar + ' ' + (open ? styles.menuBar1_closed : '')}></div>
                        <div className={styles.menuBar + ' ' + (open ? styles.menuBar2_closed : '')}></div>
                        <div className={styles.menuBar + ' ' + (open ? styles.menuBar3_closed : '')}></div>
                    </div>
                </div> 
                {
                    eventName ?
                    <h2 className={styles.eventName}>{eventName}</h2>
                    : null
                }
                {currentTab &&
                    <menu className={styles.tabs}>
                        {tabs.map((tab, index) => {
                            return <li key={index}><Link href={baseURL + tab} passHref><button className={`button button-terciary ${currentTab === tab && 'underline'}`}>{tab}</button></Link></li>
                        })}
                    </menu>
                } 
            </div>
            <NavLinks open={open} />
        </nav>
    )
}

export default NavBar;

//` menuIcon menuIcon_${menuState}`
