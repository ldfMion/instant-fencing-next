import React, {useState} from 'react';
import styles from '../styles/NavBar.module.css'
import {NavLinks} from './NavLinks'
import Link from 'next/link'

const NavBar = (props) => {
    const [open, setOpen] = useState(false)
    console.log(props.tabs)
    
    const tabs = [
         "starter",
        'pools',
        'pool-results',
        //'direct-elimination',
        //'results',
    ]

    const baseURL = `/event/${props.eventId}/`

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
            {props.tabs &&
                <ul className='tab-navigation'>
                    {tabs.map((tab, index) => {
                        console.log('is on tabs map')
                        console.log(tab)
                        console.log(props.currentTab)
                        return <li key={index}><Link href={baseURL + tab}><button className={`button button-terciary ${props.currentTab === tab && 'bold'}`}>{tab}</button></Link></li>
                    })}
                </ul>
            } 
            <NavLinks open={open} />
        </nav>
    )
}

export default NavBar;

//` menuIcon menuIcon_${menuState}`
