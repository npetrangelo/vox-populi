// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

import {CountingStrategy} from "./CountingStrategy";

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
    ballots: Array<Ballot<Vote>>
    strategy: CountingStrategy<Vote>
    protected constructor(size: number, strategy: CountingStrategy<Vote>) {
        this.isOpen = true;
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

    get numVoted(): number {
        return this.ballots.filter(ballot => ballot != null).length;
    }

    abstract getWinningVotes(): [winner: Vote, votes: number, numVoted: number];

    getWinner(): Vote {
        return this.strategy.getWinner(this);
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
