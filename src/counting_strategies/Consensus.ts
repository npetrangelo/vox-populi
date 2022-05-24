import {BallotBox} from "../ballot_boxes/BallotBox";
import {CountingStrategy} from "./CountingStrategy";

export class VoterConsensus<Vote> implements CountingStrategy<Vote> {
    consensus: number

    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = box.getWinningVotes();
        return (votes >= this.consensus * box.numVoted) ? winner : null;
    }
}

export class GlobalConsensus<Vote> implements CountingStrategy<Vote> {
    consensus: number

    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = box.getWinningVotes();
        return (votes >= this.consensus * box.ballots.length) ? winner : null;
    }
}
