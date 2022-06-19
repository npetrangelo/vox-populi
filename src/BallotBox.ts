// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

import {CountingStrategy} from "./CountingStrategy";
import Histogram from "./Histogram";

class Ballot {
    vote: any
    timestamp: number
    constructor(vote: any) {
        this.vote = vote;
        this.timestamp = Date.now();
    }
}

export class BallotBox {
    isOpen: boolean
    size: number
    strategy: CountingStrategy
    ballots: Map<string, Ballot>
    histogram: Histogram
    constructor(size: number, strategy: CountingStrategy) {
        this.isOpen = true;
        this.size = size;
        this.strategy = strategy;
        this.ballots = new Map<string, Ballot>();
        this.histogram = new Histogram();
    }

    placeVote(key: string, vote: any) {
        if (!this.isOpen) {
            throw new Error("box is closed");
        }

        if (!this.strategy.canCount(vote)) {
            throw new Error("vote is not the right type");
        }

        if (this.ballots.has(key)) {
            // Overriding a previous vote, subtract old vote from histogram
            let oldVote = this.ballots.get(key).vote;
            this.histogram.subtract(oldVote);
        }
        this.histogram.add(vote);
        this.ballots.set(key, new Ballot(vote));
    }

    close(): any {
        this.isOpen = false;
        return this.getWinner();
    }

    get numVoted(): number {
        return Array.from(this.ballots.keys()).length;
    }

    getWinner(): any {
        return this.strategy.getWinner(this);
    }

    merge(that: BallotBox) {
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

    get votes(): Map<string, any> {
        let votes = new Map<string, any>();
        for (let key of this.ballots.keys()) {
            votes.set(key, this.ballots.get(key).vote);
        }
        return votes;
        // return Array.from(this.ballots.values()).map(ballot => ballot.vote);
    }
}
