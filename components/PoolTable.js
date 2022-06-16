import React from 'react'
import styles from '../styles/PoolTable.module.css'

export function PoolTable({fencers}) {
    /*
  return (
    <table className={"card " + styles.poolTable}>
            <thead className={styles.poolTableHead}>
                <tr>
                    <th> </th>
                    <th> </th>
                    {fencers.map(
                        (fencer, index) => (
                            <th key={'head'+ index}><p>{fencer.userName}</p></th>
                        )
                    )}
                    <th><p>V</p></th>
                    <th><p>TS</p></th>
                    <th><p>TR</p></th>
                    <th><p>Ind</p></th>
                    <th><p>Pl</p></th>
                </tr>
            </thead>
            <tbody className={styles.poolTableBody}>
                {fencers.map((fencer, index) => {
                    let touchesScored = 0;
                    let touchesReceived = 0;
                    let victories = 0;
                    let losses = 0;
                    return (<>
                        <tr key={'row' + index}>
                            <th><p>{index + 1}</p></th>
                            <th><p>{fencer.userName}</p></th>
                            {fencers.map((fencer, index2) => {
                                return (<td className={styles.tableCell + ' ' + (index === index2 && styles.emptyCell)} key={`row${index}column${index2}`}>
                                    {index === index2 ? null : <p>1</p>}
                                </td>)
                            })}
                        </tr>
                    </>)
                })}
            </tbody>
        </table>
  )*/
  return (
    <table className={"card " + styles.poolTable}>
            <tbody>
                <tr>
                    <td className={styles.emptyCell + ' ' + styles.tableCell + ' ' + styles.tableCellTop}></td>
                    {fencers.map(
                        (fencer, index) => (
                            <td className={styles.tableCell + ' ' + styles.tableCellTop} key={'head'+ index}><p>{fencer.userName}</p></td>
                        )
                    )}
                    <td className={styles.tableCell + ' ' + styles.tableCellTop}><p>V</p></td>
                    <td className={styles.tableCell + ' ' + styles.tableCellTop}><p>TS</p></td>
                    <td className={styles.tableCell + ' ' + styles.tableCellTop}><p>TR</p></td>
                    <td className={styles.tableCell + ' ' + styles.tableCellTop}><p>Ind</p></td>
                    <td className={styles.tableCell + ' ' + styles.tableCellTop}><p>Pl</p></td>
                </tr>
                {fencers.map((fencer, index) => {
                    let touchesScored = 0;
                    let touchesReceived = 0;
                    let victories = 0;
                    let losses = 0;
                    return (<>
                        <tr key={'row' + index}>
                            <th className={styles.tableCell + ' ' + styles.tableCellLeft + ' ' + ((index===fencers.length-1) && styles.tableCellBottom)}><p>{index + 1}</p><p>{fencer.userName}</p></th>
                            {fencers.map((fencer, index2) => {
                                return (<td className={styles.tableCell + ' ' + (index === index2 && styles.emptyCell) + ' ' + ((index===fencers.length-1) && styles.tableCellBottom)} key={`row${index}column${index2}`}>
                                    {index === index2 ? null : <p>1</p>}
                                </td>)
                            })}
                        </tr>
                    </>)
                })}
            </tbody>
        </table>
  )
}
