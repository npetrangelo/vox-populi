import { BallotBox } from "./vote";
import {ConsensusLevel} from "./ConsensusLevel";

class MultipleChoiceBallotBox<Choice> extends BallotBox<Choice> {
    options: Array<Choice>
    constructor(size: number, consensus: number, strategy: ConsensusLevel<Choice>, options: Array<Choice>) {
        super(size, consensus, strategy);
        this.options = options;
    }

    override getWinningVotes(): [Choice, number, number] {
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

        let numNulls = this.ballots.filter(ballot => ballot == null).length;

        if (results[0][1] == results[1][1]) {
            return [null, results[0][1], this.ballots.length - numNulls];
        }

        return [results[0][0], results[0][1], this.ballots.length - numNulls];
    }
}

export default MultipleChoiceBallotBox;
