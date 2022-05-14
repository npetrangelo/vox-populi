// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

import {ConsensusLevel} from "./ConsensusLevel";

class Ballot<Vote> {
    vote: Vote
    timestamp: number
    constructor(vote) {
        this.vote = vote;
        this.timestamp = Date.now();
    }
}

export abstract class BallotBox<Vote> {
    isOpen: boolean
    consensus: number
    ballots: Array<Ballot<Vote>>
    strategy: ConsensusLevel<Vote>
    protected constructor(size: number, consensus: number, strategy: ConsensusLevel<Vote>) {
        this.isOpen = true;
        this.consensus = consensus;
        this.strategy = strategy;
        this.ballots = new Array<Ballot<Vote>>(size);
        this.ballots.fill(null);
    }

    placeVote(index: number, vote: Vote) {
        if (this.isOpen) {
            this.ballots[index] = new Ballot<Vote>(vote);
        }
    }

    close(): Vote {
        this.isOpen = false;
        return this.getWinner();
    }

    protected abstract getWinningVotes(): [winner: Vote, votes: number, numVoted: number];

    getWinner(): Vote {
        let [winner, votes, numVoted] = this.getWinningVotes();
        return this.strategy.getWinner(this, winner, votes, numVoted);
    }

    merge(that: BallotBox<Vote>) {
        for (let i = 0; i < this.ballots.length; i++) {
            if (that.ballots[i] == null) {
                continue;
            }

            if (this.ballots[i] == null) {
                this.ballots[i] = that.ballots[i];
                continue;
            }

            if (that.ballots[i].timestamp > this.ballots[i].timestamp) {
                this.ballots[i] = that.ballots[i];
            }
        }
    }

    get votes(): Array<Vote> {
        return this.ballots.map(ballot => {
            if (ballot == null) {
                return null;
            }
            return ballot.vote;
        });
    }
}
