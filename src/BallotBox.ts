// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

import {CountingStrategy} from "./CountingStrategy";
import Histogram from "./Histogram";

class Ballot<Vote> {
    vote: Vote
    timestamp: number
    constructor(vote: Vote) {
        this.vote = vote;
        this.timestamp = Date.now();
    }
}

export class BallotBox<Vote> {
    isOpen: boolean
    size: number
    strategy: CountingStrategy<Vote>
    ballots: Map<string, Ballot<Vote>>
    histogram: Histogram<Vote>
    constructor(size: number, strategy: CountingStrategy<Vote>) {
        this.isOpen = true;
        this.size = size;
        this.strategy = strategy;
        this.ballots = new Map<string, Ballot<Vote>>();
        this.histogram = new Histogram<Vote>();
    }

    placeVote(key: string, vote: Vote) {
        if (this.isOpen) {
            if (this.ballots.has(key)) {
                // Overriding a previous vote, subtract old vote from histogram
                let oldVote = this.ballots.get(key).vote;
                this.histogram.subtract(oldVote);
            }
            this.histogram.add(vote);
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
            let vote = that.ballots.get(key).vote;
            if (!this.ballots.has(key)) {
                this.histogram.add(vote);
                this.ballots.set(key, that.ballots.get(key));
                continue;
            }

            if (that.ballots.get(key).timestamp > this.ballots.get(key).timestamp) {
                let oldVote = this.ballots.get(key).vote;
                this.histogram.subtract(oldVote);
                this.histogram.add(vote);
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
