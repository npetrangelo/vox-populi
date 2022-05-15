import {BallotBox} from "./vote";

export interface ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>): Vote;
}

export class VoterConsensus<Vote> implements ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes, numVoted] = box.getWinningVotes();
        return (votes >= box.consensus * numVoted) ? winner : null;
    }
}

export class GlobalConsensus<Vote> implements ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes, numVoted] = box.getWinningVotes();
        return (votes >= box.consensus * box.ballots.length) ? winner : null;
    }
}
