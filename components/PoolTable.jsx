import React from "react";
import styles from "../styles/PoolTable.module.css";

export function PoolTable({ fencers, bouts }) {
	return (
		<div className={`card ${styles.poolTableScrollContainer}`}>
			<table className={styles.poolTable}>
				<tbody>
					<tr>
						<td
							className={
								styles.emptyCell +
								" " +
								styles.tableCell +
								" " +
								styles.tableCellTop + " " + 
                                styles.tableCellLeft
							}
						></td>
						{fencers.map((fencer, index) => (
							<td
								className={
									styles.tableCell + " " + styles.tableCellTop
								}
								key={"head" + index}
							>
								<p >{fencer.userName}</p>
							</td>
						))}
						<td className={styles.separationColumnHeader}></td>
						<td
							className={
								styles.tableCell + " " + styles.tableCellTop
							}
						>
							<p>V</p>
						</td>
						<td
							className={
								styles.tableCell + " " + styles.tableCellTop
							}
						>
							<p>TS</p>
						</td>
						<td
							className={
								styles.tableCell + " " + styles.tableCellTop
							}
						>
							<p>TR</p>
						</td>
						<td
							className={
								styles.tableCell + " " + styles.tableCellTop
							}
						>
							<p>V/M</p>
						</td>
						<td
							className={
								styles.tableCell + " " + styles.tableCellTop
							}
						>
							<p>Ind</p>
						</td>
					</tr>
					{fencers.map((fencer, index) => {
						//console.log(`is on first loop with ${fencer.userName}`);
						let touchesScored = 0;
						let touchesReceived = 0;
						let victories = 0;
						let defeats = 0;
						return (
							<>
								<tr key={"row" + index}>
									<th
										className={
											styles.tableCell +
											" " +
											styles.tableCellLeft +
											" " +
											(index === fencers.length - 1 &&
												styles.tableCellBottom)  
										}
									>
										<p className={styles.rowNumber}>
											{index + 1}
										</p>
										<p >{fencer.userName}</p>
									</th>
									{fencers.map((fencer2, index2) => {
										//console.log(`is on second loop with ${fencer2.userName}`);
										let score = 0;
										let victory;
										bouts.forEach(bout => {
											if (
												fencer.userName ===
													bout.fencerAUserName &&
												fencer2.userName ===
													bout.fencerBUserName
											) {
												score = bout.fencerAScore;
												touchesScored += score;
												touchesReceived +=
													bout.fencerBScore;
												if (
													bout.fencerAScore >
													bout.fencerBScore
												) {
													victories++;
													victory = true;
												} else if (
													bout.fencerAScore <
													bout.fencerBScore
												) {
													defeats++;
													victory = false;
												} else {
													//tie
												}
											} else if (
												fencer.userName ===
													bout.fencerBUserName &&
												fencer2.userName ===
													bout.fencerAUserName
											) {
												score = bout.fencerBScore;
												touchesScored += score;
												touchesReceived +=
													bout.fencerAScore;
												if (
													bout.fencerAScore >
													bout.fencerBScore
												) {
													defeats++;
													victory = false;
												} else if (
													bout.fencerAScore <
													bout.fencerBScore
												) {
													victories++;
													victory = true;
												} else {
													//tie
												}
											}
										});
										return (
											<td
												className={
													styles.tableCell +
													" " +
													(index === index2 &&
														styles.emptyCell) +
													" " +
													(index ===
														fencers.length - 1 &&
														styles.tableCellBottom) +
													" " +
													"cell-number" +
													" " +
													(victory && "success") +
													" " +
													(victory === false &&
														"fail")
												}
												key={`row${index}column${index2}`}
											>
												{index === index2 ? null : (
													<p>{score}</p>
												)}
											</td>
										);
									})}
									<td> </td>
									<td className={styles.tableCell}>
										<p>{victories}</p>
									</td>
									<td className={styles.tableCell}>
										<p>{touchesScored}</p>
									</td>
									<td className={styles.tableCell}>
										<p>{touchesReceived}</p>
									</td>
									<td className={styles.tableCell}>
										<p>
											{victories + defeats === 0
												? "N/A"
												: victories /
												  (victories + defeats)}
										</p>
									</td>
									<td className={styles.tableCell}>
										<p>{touchesScored - touchesReceived}</p>
									</td>
								</tr>
							</>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}