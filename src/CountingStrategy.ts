import {BallotBox} from "./BallotBox";

export function getWinningVotes(box: BallotBox): [any, number] {
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

export interface CountingStrategy {
    /**
     * Returns true if the counting strategy can count the vote
     * @param vote
     */
    canCount(vote: any): boolean;
    getWinner(box: BallotBox): any;
}

/**
 * Requires a percentage of members to opt in
 */
export class Consensus implements CountingStrategy {
    threshold!: number

    constructor(threshold: number) {
        this.threshold = threshold;
    }

    canCount(vote: any): boolean {
        return true;
    }

    getWinner(box: BallotBox): any {
        let [winner, votes] = getWinningVotes(box);
        return (votes > this.threshold * box.size) ? winner : null;
    }

    static check(strategy: CountingStrategy): strategy is Consensus {
        return typeof (strategy as Consensus).threshold == "number";
    }
}

/**
 * Requires a percentage of members to opt out
 */
export class Consent implements CountingStrategy {
    threshold!: number
    constructor(threshold: number) {
        this.threshold = threshold;
    }

    canCount(vote: any): boolean {
        return true;
    }

    getWinner(box: BallotBox): any {
        let [winner, votes] = getWinningVotes(box);
        let opposed = box.numVoted - votes;
        return (opposed <= this.threshold * box.size) ? winner : null;
    }

    static check(strategy: CountingStrategy): strategy is Consent {
        return typeof (strategy as Consent).threshold == "number";
    }
}

export class Plurality implements CountingStrategy {
    threshold?: number
    constructor(threshold?: number) {
        if (threshold) {
            this.threshold = threshold;
        }
    }

    canCount(vote: any): boolean {
        return true;
    }

    getWinner(box: BallotBox): any {
        let [winner, votes] = getWinningVotes(box);
        if (!this.threshold) {
            return winner;
        }
        return (votes >= this.threshold * box.numVoted) ? winner : null;
    }
}

export class Quorum implements CountingStrategy {
    ifEnough!: CountingStrategy
    threshold!: number
    constructor(threshold: number, ifEnough: CountingStrategy) {
        this.ifEnough = ifEnough;
        this.threshold = threshold;
    }

    canCount(vote: any): boolean {
        return this.ifEnough.canCount(vote);
    }

    getWinner(box: BallotBox): any {
        // No one wins unless enough people have voted
        if (box.numVoted <= this.threshold * box.size) {
            return null;
        }
        return this.ifEnough.getWinner(box);
    }

    static check(strategy: CountingStrategy): strategy is Quorum {
        let s = strategy as Quorum;
        return typeof s.threshold == "number" && typeof s.ifEnough == "object";
    }
}

export class Average implements CountingStrategy {
    canCount(vote: any): boolean {
        return typeof vote === "number";
    }

    getWinner(box: BallotBox): number {
        let sum = 0;
        for (let [vote, frequency] of box.histogram.map.entries()) {
            sum += vote * frequency
        }
        return sum/box.numVoted;
    }
}
