import {BallotBox} from "../ballot_boxes/BallotBox";
import {CountingStrategy} from "./CountingStrategy";
import Histogram from "../Histogram";

function getWinningVotes<Choice>(box: BallotBox<Choice>): [Choice, number] {
    if (box.histogram.size == 0) {
        return [null, 0];
    }
    if (box.histogram.size == 1) {
        return box.histogram.topN(1)[0];
    }

    let [max, second] = box.histogram.topN(2);
    if (max[1] == second[1]) {
        return [null, max[1]];
    }
    return max;
}

export class VoterConsensus<Vote> implements CountingStrategy<Vote> {
    consensus: number

    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = getWinningVotes(box);
        return (votes >= this.consensus * box.numVoted) ? winner : null;
    }
}

export class GlobalConsensus<Vote> implements CountingStrategy<Vote> {
    consensus: number

    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = getWinningVotes(box);
        return (votes >= this.consensus * box.size) ? winner : null;
    }
}
