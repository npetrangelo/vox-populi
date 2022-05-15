import { BallotBox } from "./vote";
import {CountingStrategy} from "./CountingStrategy";

class BooleanBallotBox extends BallotBox<boolean> {
    constructor(size: number, strategy: CountingStrategy<boolean>) {
        super(size, strategy);
    }

    getWinningVotes(): [boolean, number] {
        let yay = 0;
        for (let ballot of this.ballots) {
            if (ballot != null) {
                yay += (ballot.vote) ? 1 : 0;
            }
        }
        return [true, yay];
    }
}

export default BooleanBallotBox;
