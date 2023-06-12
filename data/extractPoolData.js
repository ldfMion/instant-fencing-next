function extractPoolResultData(fencers, bouts) {
    console.log("is on extract pool data")

    const fencersMap = fencers.reduce((map, fencer) => map.set(fencer.id, fencer), new Map())
    
	let complete = true;

	bouts.forEach(bout => {

        const fencerA = fencersMap.get(bout.fencerAId);
        const fencerB = fencersMap.get(bout.fencerBId);

		fencerA.addTouchesScored(bout.fencerAScore);
		fencerA.addTouchesReceived(bout.fencerBScore);
		fencerB.addTouchesScored(bout.fencerBScore);
		fencerB.addTouchesReceived(bout.fencerAScore);

		if (bout.fencerAScore > bout.fencerBScore) {
			fencerA.incrementVictories();
			fencerB.incrementDefeats();

		} else if (bout.fencerAScore < bout.fencerBScore) {
			fencerA.incrementDefeats();
			fencerB.incrementVictories();

		} else {
			complete = false;
		}
	});

	const sortedFencerArray = getSortedFencersForPoolResults(Array.from(fencersMap.values()));

	return {
		fencersWithScoreDataFromBouts: sortedFencerArray,
		complete,
	};
};

export default extractPoolResultData;

function getSortedFencersForPoolResults(fencersArray){

    const newFencers = [...fencersArray]

    newFencers.sort((fencerA, fencerB) => {
		if (fencerA.victoriesOverMatches === fencerB.victoriesOverMatches) {
			return fencerB.index - fencerA.index;
		} else {
			return fencerB.victoriesOverMatches - fencerA.victoriesOverMatches;
		}
	});
    
    return newFencers
    
}