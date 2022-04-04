import React from 'react'

export function PoolTable({fencers}) {
  return (
    <table>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
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
            <tbody>
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
                                return (<td key={`row${index}column${index2}`}>
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
