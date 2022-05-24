import { BallotBox } from "../vote";
import {CountingStrategy} from "../counting_strategies/CountingStrategy";

class MultipleChoiceBallotBox<Choice> extends BallotBox<Choice> {
    options: Array<Choice>
    constructor(size: number, strategy: CountingStrategy<Choice>, options: Array<Choice>) {
        super(size, strategy);
        this.options = options;
    }

    override getWinningVotes(): [Choice, number] {
        let options = new Map<Choice, number>(this.options.map(v => [v, 0]));
        for (let ballot of this.ballots) {
            if (ballot == null) {
                continue;
            }

            options.set(ballot.vote, options.get(ballot.vote) + 1);
        }
        let results: Array<[Choice, number]> = Array.from(options.entries())
            .sort(([c1, n1], [c2, n2]) => {
                return n2 - n1;
            });

        if (results[0][1] == results[1][1]) {
            return [null, results[0][1]];
        }

        return results[0];
    }
}

export default MultipleChoiceBallotBox;
