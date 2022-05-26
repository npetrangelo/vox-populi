import {BallotBox} from "../ballot_boxes/BallotBox";

export interface CountingStrategy<Vote> {
    getWinner(box: BallotBox<Vote>): Vote;
}

export class VoterThreshold<Vote> implements CountingStrategy<Vote> {
    ifEnough: CountingStrategy<Vote>
    threshold: number
    constructor(threshold: number, ifEnough: CountingStrategy<Vote>) {
        this.ifEnough = ifEnough;
        this.threshold = threshold;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        // No one wins unless enough people have voted
        if (box.numVoted < this.threshold * box.size) {
            return null;
        }
        return this.ifEnough.getWinner(box);
    }
}

export class Average implements CountingStrategy<number> {
    getWinner(box: BallotBox<number>): number {
        return Array.from(box.votes.values()).reduce((previousValue, currentValue) => previousValue + currentValue)/box.numVoted;
    }
}
