import React from "react";

const ParticipantCard = ({fencerUserName, number}) => {
	return (
		<div className={`participant-card`}>
			<p className="row-number">{number}</p>
			<p className="bold left-align">{fencerUserName}</p>
		</div>
	);
};

export default ParticipantCard;
