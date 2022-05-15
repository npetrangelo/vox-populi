import {BallotBox} from "./vote";
import MultipleChoiceBallotBox from "./MultipleChoiceBallotBox";

export interface ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>): Vote;
}

export class VoterConsensus<Vote> implements ConsensusLevel<Vote> {
    consensus: number
    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes, numVoted] = box.getWinningVotes();
        return (votes >= this.consensus * numVoted) ? winner : null;
    }
}

export class GlobalConsensus<Vote> implements ConsensusLevel<Vote> {
    consensus: number
    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes, numVoted] = box.getWinningVotes();
        return (votes >= this.consensus * box.ballots.length) ? winner : null;
    }
}

export class Average implements ConsensusLevel<number> {
    getWinner(box: MultipleChoiceBallotBox<number>): number {
        return box.votes.reduce((previousValue, currentValue) => previousValue + currentValue)/box.numVoted;
    }
}
