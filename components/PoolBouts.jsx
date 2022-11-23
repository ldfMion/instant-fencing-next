import React from 'react'
import styles from '../styles/PoolBouts.module.css'
import BoutSide from './BoutSide'

export function PoolBouts({fencers, bouts}) {

    const keyFencers = {};
    fencers.forEach(fencer => {
        keyFencers[fencer.id] = fencer;
    })

    return (
    <>
        <h4>Bouts</h4>
        <ol className={styles.bouts}>
            {
                bouts.sort((prev, curr) => {
                    return prev.boutNumber - curr.boutNumber
                }).map((bout, index) => {
                    return <li key={index} className={styles.bout}>
                        <p>{bout.boutNumber}</p>
                        <div className={'card' + ' ' +  styles.boutContainer}>
                            <BoutSide fencer={keyFencers[bout.fencerAId]} fencerNumber={bout.fencerANumber} fencerScore={bout.fencerAScore} updateScore={bout.updateScoreA}/>
                            <BoutSide fencer={keyFencers[bout.fencerBId]} fencerNumber={bout.fencerBNumber} fencerScore={bout.fencerBScore} updateScore={bout.updateScoreB}/>
                        </div>
                       
                    </li>
                })
            }
        </ol>
    </>
    )
}