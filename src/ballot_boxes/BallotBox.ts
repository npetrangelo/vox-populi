// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

import {CountingStrategy} from "../counting_strategies/CountingStrategy";

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
    size: number
    ballots: Map<string, Ballot<Vote>>
    strategy: CountingStrategy<Vote>
    protected constructor(size: number, strategy: CountingStrategy<Vote>) {
        this.isOpen = true;
        this.strategy = strategy;
        this.size = size;
        this.ballots = new Map<string, Ballot<Vote>>();
    }

    placeVote(key: string, vote: Vote) {
        if (this.isOpen) {
            this.ballots.set(key, new Ballot<Vote>(vote));
        }
    }

    close(): Vote {
        this.isOpen = false;
        return this.getWinner();
    }

    get numVoted(): number {
        return Array.from(this.ballots.keys()).length;
    }

    abstract getWinningVotes(): [winner: Vote, votes: number];

    getWinner(): Vote {
        return this.strategy.getWinner(this);
    }

    merge(that: BallotBox<Vote>) {
        if (this.size != that.size) {
            return;
        }
        if (!that.isOpen) {
            this.isOpen = false;
        }
        for (let key of that.ballots.keys()) {
            if (!this.ballots.has(key)) {
                this.ballots.set(key, that.ballots.get(key));
                continue;
            }

            if (that.ballots.get(key).timestamp > this.ballots.get(key).timestamp) {
                this.ballots.set(key, that.ballots.get(key));
            }
        }
    }

    get votes(): Map<string, Vote> {
        let votes = new Map<string, Vote>();
        for (let key of this.ballots.keys()) {
            votes.set(key, this.ballots.get(key).vote);
        }
        return votes;
        // return Array.from(this.ballots.values()).map(ballot => ballot.vote);
    }
}
