import React from "react";
import styles from "../styles/BoutSide.module.css";

//import {auth} from '../firebase/firebase.js'
//import { useAuthState } from 'react-firebase-hooks/auth';

export const BoutSide = ({
	fencer,
	fencerNumber,
	fencerScore,
	updateScore,
}) => {

    //const [user] = useAuthState(auth);

	return (
		<div className={styles.boutSide}>
			<p>{fencerNumber}</p>
			<p className="fill-container">{fencer.userName}</p>
            <input
                type="number"
                pattern="[0-9]*"
                className={styles.scoreInput}
                value={fencerScore}
                max={5}
                min={0}
                onChange={e => {
                    const score = e.target.value;
                    if(score > 5 || score < 0) return
                    updateScore(parseInt(score));
                }}
                //disabled={!user}
            ></input>
		</div>
	);
};

export default BoutSide;
