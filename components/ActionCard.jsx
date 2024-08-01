import React from "react";
import styles from "../styles/ActionCard.module.css";
import Link from "next/link";

const ActionCard = ({ text, index, children }) => {
	return (
		<div className={`card ${styles.action}`}>
			<div className={styles.actionText}>
				<div className={styles.actionNumberContainer}>
					<p className={styles.actionNumber}>{index}</p>
				</div>
				<p>{text}</p>
			</div>
			{children}
		</div>
	);
};

export default ActionCard;
