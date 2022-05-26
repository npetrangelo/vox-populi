import {BallotBox} from "../ballot_boxes/BallotBox";
import {CountingStrategy} from "./CountingStrategy";

function getWinningVotes<Choice>(box: BallotBox<Choice>): [Choice, number] {
    let histogram = new Map<Choice, number>();

    for (let vote of box.votes.values()) {
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
