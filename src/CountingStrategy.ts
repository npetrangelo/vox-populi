import {BallotBox} from "./BallotBox";

export function getWinningVotes<Choice>(box: BallotBox<Choice>): [Choice, number] {
    if (box.histogram.size == 0) {
        return [null, 0];
    }
    if (box.histogram.size == 1) {
        return box.histogram.topN(1)[0];
    }

    let [max, second] = box.histogram.topN(2);
    if (max[1] == second[1]) {
        return [null, max[1]];
    }
    return max;
}

export interface CountingStrategy<Vote> {
    getWinner(box: BallotBox<Vote>): Vote;
}

/**
 * Requires a percentage of members to opt in
 */
export class Consensus<Vote> implements CountingStrategy<Vote> {
    threshold: number

    constructor(threshold: number) {
        this.threshold = threshold;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = getWinningVotes(box);
        return (votes > this.threshold * box.size) ? winner : null;
    }
}

/**
 * Requires a percentage of members to opt out
 */
export class Consent<Vote> implements CountingStrategy<Vote> {
    threshold: number
    constructor(threshold: number) {
        this.threshold = threshold;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = getWinningVotes(box);
        let opposed = box.numVoted - votes;
        return (opposed <= this.threshold * box.size) ? winner : null;
    }
}

export class Plurality<Vote> implements CountingStrategy<Vote> {
    threshold?: number
    constructor(threshold?: number) {
        if (threshold) {
            this.threshold = threshold;
        }
    }

    getWinner(box: BallotBox<Vote>): Vote {
        let [winner, votes] = getWinningVotes(box);
        if (!this.threshold) {
            return winner;
        }
        return (votes >= this.threshold * box.numVoted) ? winner : null;
    }
}

export class Quorum<Vote> implements CountingStrategy<Vote> {
    ifEnough: CountingStrategy<Vote>
    threshold: number
    constructor(threshold: number, ifEnough: CountingStrategy<Vote>) {
        this.ifEnough = ifEnough;
        this.threshold = threshold;
    }

    getWinner(box: BallotBox<Vote>): Vote {
        // No one wins unless enough people have voted
        if (box.numVoted <= this.threshold * box.size) {
            return null;
        }
        return this.ifEnough.getWinner(box);
    }
}

export class Average implements CountingStrategy<number> {
    getWinner(box: BallotBox<number>): number {
        let sum = 0;
        for (let [vote, frequency] of box.histogram.map.entries()) {
            sum += vote * frequency
        }
        return sum/box.numVoted;
    }
}
