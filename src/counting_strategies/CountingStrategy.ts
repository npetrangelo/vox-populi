import {BallotBox} from "../ballot_boxes/ballotBox";
import MultipleChoiceBallotBox from "../ballot_boxes/MultipleChoiceBallotBox";

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
        if (box.numVoted < this.threshold * box.ballots.length) {
            return null;
        }
        return this.ifEnough.getWinner(box);
    }
}

export class Average implements CountingStrategy<number> {
    getWinner(box: MultipleChoiceBallotBox<number>): number {
        return box.votes.reduce((previousValue, currentValue) => previousValue + currentValue)/box.numVoted;
    }
}
