import BallotBox from "./vote";

class BooleanBallotBox extends BallotBox<boolean> {
    threshold: number
    constructor(threshold: number) {
        super();
        this.threshold = threshold;
    }

    getWinner = (): boolean => {
        let yay = 0;
        this.votes.forEach((ballot) => {
            yay += (ballot.vote) ? 1 : 0;
        });
        return yay > (this.threshold * this.votes.length);
    };
}

export default BooleanBallotBox;
