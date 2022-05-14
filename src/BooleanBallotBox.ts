import BallotBox from "./vote";

class BooleanBallotBox extends BallotBox<boolean> {
    consensus: number
    constructor(size: number, consensus: number) {
        super(size);
        this.consensus = consensus;
    }

    getWinner = (): boolean => {
        let yay = 0;
        for (let ballot of this.votes) {
            yay += (ballot.vote) ? 1 : 0;
            if (yay >= (this.consensus * this.votes.length)) {
                return true;
            }
        }
        return false;
    };
}

export default BooleanBallotBox;
