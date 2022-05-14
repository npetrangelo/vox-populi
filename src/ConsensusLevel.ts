import {BallotBox} from "./vote";

export interface ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>, winner: Vote, votes: number, voters: number): Vote;
}

export class VoterConsensus<Vote> implements ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>, winner: Vote, votes: number, numVoted: number): Vote {
        return (votes >= box.consensus * numVoted) ? winner : null;
    }
}

export class GlobalConsensus<Vote> implements ConsensusLevel<Vote> {
    getWinner(box: BallotBox<Vote>, winner: Vote, votes: number): Vote {
        return (votes >= box.consensus * box.ballots.length) ? winner : null;
    }
}
