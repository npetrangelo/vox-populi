import BallotBox from "./vote";

class BooleanBallotBox extends BallotBox<boolean> {
    consensus: number
    constructor(size: number, consensus: number) {
        super(size);
        this.consensus = consensus;
    }

    getWinner = (): boolean => {
        let yay = 0;
        this.votes.forEach((ballot) => {
            yay += (ballot.vote) ? 1 : 0;
        });
        return yay >= (this.consensus * this.votes.length);
    };
}

export default BooleanBallotBox;
