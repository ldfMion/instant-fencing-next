import Fencer from "./Fencer"

class PoolResultFencer extends Fencer {

    touchesScored = 0;
    touchesReceived = 0;
    victories = 0;
    defeats = 0;

    constructor(args){
        super(args)
    }

    incrementVictories(){
        this.victories++;
    }
    incrementDefeats(){
        this.defeats++;
    }
    addTouchesScored(boutTouches){
        this.validateTouchesToAdd(boutTouches)
        this.touchesScored += boutTouches
    }
    addTouchesReceived(boutTouches){
        this.validateTouchesToAdd(boutTouches)
        this.touchesReceived += boutTouches
    }
    validateTouchesToAdd(boutTouches){
        if(boutTouches < 0) throw new Error("can't add negative touches")
    }
    get victoriesOverMatches(){
        if(this.noBoutsFenced()){
            return 0;
        }
        return this.victories / (this.victories + this.defeats);
    }
    get index(){
        return this.touchesScored - this.touchesReceived
    }
    noBoutsFenced() {
        return this.victories + this.defeats === 0
    }
}

export default PoolResultFencer;