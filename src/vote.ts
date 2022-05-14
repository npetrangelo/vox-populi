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
    ballots: Array<Ballot<Vote>>
    strategy: CountingStrategy<Vote>
    protected constructor(size: number, strategy: CountingStrategy<Vote>) {
        this.strategy = strategy;
        this.ballots = new Array<Ballot<Vote>>(size);
        this.ballots.fill(null);
    }

    placeVote(index: number, vote: Vote) {
        this.ballots[index] = new Ballot<Vote>(vote);
    }

    protected abstract getWinningVotes(): [winner: Vote, votes: number];

    getWinner(): Vote {
        let [winner, votes] = this.getWinningVotes();
        return this.strategy.getWinner(this, winner, votes);
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
