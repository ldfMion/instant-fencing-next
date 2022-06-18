import React from "react";
import styles from "../styles/BoutSide.module.css";

export const BoutSide = ({
	fencer,
	fencerNumber,
	fencerScore,
	updateScore,
}) => {
	return (
		<div className={styles.boutSide}>
			<p>{fencerNumber}</p>
			<p className="fill-container">{fencer.userName}</p>
			<input
				type="number"
				className={styles.scoreInput}
				value={fencerScore}
                max={5}
                min={0}
				onChange={e => {
                    const score = e.target.value;
                    if(score > 5 || score < 0) return
					updateScore(parseInt(score));
				}}
			></input>
		</div>
	);
};

export default BoutSide;
