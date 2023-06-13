class Fencer {
	id;
	startingRank;
	//pool;
	userName;
    userId;
	constructor({ id, userName, startingRank, userId }) {
		this.id = id;
		this.userName = userName;
		this.startingRank = startingRank;
        this.userId = userId

	}
}

export default Fencer