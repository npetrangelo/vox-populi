import { BallotBox } from "./BallotBox";
import {CountingStrategy} from "../counting_strategies/CountingStrategy";

class MultipleChoiceBallotBox<Choice> extends BallotBox<Choice> {
    options: Set<Choice>
    constructor(size: number, strategy: CountingStrategy<Choice>, options: Set<Choice>) {
        super(size, strategy);
        this.options = options;
    }

    // TODO: Throw exception when given a vote that isn't in the options
    override placeVote(index: string, vote: Choice) {
        if (this.options.has(vote)) {
            super.placeVote(index, vote);
        }
    }

    override getWinningVotes(): [Choice, number] {
        let histogram = new Map<Choice, number>();

        for (let vote of this.votes.values()) {
            if (!histogram.has(vote)) {
                histogram.set(vote, 0);
            }
            histogram.set(vote, histogram.get(vote) + 1);
        }

        let max: [Choice, number] = [null, 0];
        let second: [Choice, number] = max;
        for (let entry of histogram.entries()) {
            if (entry[1] >= max[1]) {
                second = max;
                max = entry;
            }
        }
        if (max[1] == second[1]) {
            return [null, max[1]];
        }

        return max;
    }
}

export default MultipleChoiceBallotBox;
