import { ConsensusBallotBox } from "./vote";

class BooleanBallotBox extends ConsensusBallotBox<boolean> {
    constructor(size: number, consensus: number) {
        super(size, consensus);
    }

    protected getWinningVotes(): [boolean, number] {
        let yay = 0;
        for (let ballot of this.votes) {
            yay += (ballot.vote) ? 1 : 0;
        }
        return [true, yay];
    }
}

export default BooleanBallotBox;
