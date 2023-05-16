class Fencer {
	id;
	startingRank;
	//pool;
	userName;
	constructor({ id, userName, startingRank }) {
		this.id = id;
		this.userName = userName;
		this.startingRank = startingRank;
	}
}

export default Fencer