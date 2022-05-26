import { BallotBox } from "./BallotBox";
import {CountingStrategy} from "../counting_strategies/CountingStrategy";

class BooleanBallotBox extends BallotBox<boolean> {
    constructor(size: number, strategy: CountingStrategy<boolean>) {
        super(size, strategy);
    }

    getWinningVotes(): [boolean, number] {
        let yay = 0;
        for (let vote of this.votes.values()) {
            yay += vote ? 1 : -1;
        }
        return [true, yay];
    }
}

export default BooleanBallotBox;
