import { BallotBox } from "./vote";
import {CountingStrategy} from "./CountingStrategy";

class BooleanBallotBox extends BallotBox<boolean> {
    constructor(size: number, strategy: CountingStrategy<boolean>) {
        super(size, strategy);
    }

    getWinningVotes(): [boolean, number, number] {
        let numVotes = 0;
        let yay = 0;
        for (let ballot of this.ballots) {
            if (ballot != null) {
                numVotes++;
                yay += (ballot.vote) ? 1 : 0;
            }
        }
        return [true, yay, numVotes];
    }
}

export default BooleanBallotBox;
