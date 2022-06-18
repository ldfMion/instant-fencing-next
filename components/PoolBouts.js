import React from 'react'
import styles from '../styles/PoolBouts.module.css'
import BoutSide from './BoutSide'

export function PoolBouts({fencers, bouts}) {

    const keyFencers = {};
    fencers.forEach(fencer => {
        keyFencers[fencer.id] = fencer;
    })
    console.log(keyFencers)

    return (
    <>
        <h4>Bouts</h4>
        <ol className={styles.bouts}>
            {
                bouts.sort((prev, curr) => {
                    return prev.boutNumber - curr.boutNumber
                }).map((bout, index) => {
                    console.log(bout.updateScoreA)
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

const boutOrder = [
    //bout order lists the fencers' index normally, but arrays start in 0, so when used you must use -1

    //for 2 fencers
    [[1, 2]],
    //for 3 fencers
    [[1, 2], [1,3], [2,3]], 
    //for 4 fencers
    [[1, 4], [2, 3], [1, 3], [2,4], [3, 4], [1, 2]],
    //for 5 fencers
    [[1, 2], [3, 4], [5, 1], [2, 3], [5 ,4], [1, 3], [2, 5], [4, 1], [3, 5], [4,2]],
    //for 6 fencers
    [[1, 2], [4,5], [2,3], [5,6], [3,1], [2,5], [1,4], [5,3], [1,6], [4,2], [3,6], [5,1], [3,4], [6,2]],
    //for 7 fencers
    [[1, 4], [2,5], [3,6], [7,1], [5,4], [2,3],[5,1], [6,2], [5,7], [3,1], [4,6], [7,2], [3,5], [1,6], [2,4], [7,3], [6,5], [1,2], [4,7]],
    //for 8 fencers
    [[2,3], [1,5], [7,4], [6,8], [1,2], [3,4], [5,6], [8,7], [4,1], [5,2], [8,3], [6,7], [4,2], [8,1], [7,5], [3,6], [2,8], [5,4], [6,1], [3,7], [4,8], [2,6], [3,5], [1,7], [4,6], [8,5], [7,2] [1,3]],
    //for 9 fencers
    [[1,9], [2,8], [3,7], [4,6], [1,5], [2,9], [8,3], [7,4], [6,5], [1,2], [9,3], [8,4], [7,5], [6,1], [3,2], [9,4], [5,8], [7,6], [3,1], [2,4], [5,9], [8,6], [7,1], [4,3], [5,2], [6,9], [8,7], [4,1], [5,3], [6,2], [9,7], [1,8], [4,5], [3,6], [2,7], [9,8]],
    //for 10 fencers
    [[5,6], [6,9], [2,5], [7,10], [3,1], [8,6], [4,5], [9,10], [2,3], [7,8], [5,1], [10,6], [4,2], [9,7], [5,3], [10,8], [1,2], [6,7], [3,4], [8,9], [5,10], [1,6], [2,7], [3,8], [4,9], [6,5], [10,2], [8,1], [7,4], [9,3], [2,6], [5,8], [4,10], [1,9], [3,7], [8,2], [6,4], [9,5], [10,3], [7,1], [4,8], [2,9], [3,6], [5,7], [1,10]]
]