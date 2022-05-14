import {BallotBox} from "./vote";

export interface CountingStrategy<Vote> {
    placeVote(box: BallotBox<Vote>, index: number, vote: Vote): void;
    getWinner(box: BallotBox<Vote>, winner: Vote, votes: number): Vote;
}

export class Closeable<Vote> implements CountingStrategy<Vote> {
    isOpen: boolean;

    constructor(isOpen: boolean) {
        this.isOpen = isOpen;
    }

    getWinner(box: BallotBox<Vote>, winner: Vote): Vote {
        return winner;
    }

    placeVote(box: BallotBox<Vote>, index: number, vote: Vote): void {
        if (this.isOpen) box.placeVote(index, vote);
    }

    close() {
        this.isOpen = false;
    }
}

export class Consensus<Vote> implements CountingStrategy<Vote> {
    consensus: number

    constructor(consensus: number) {
        this.consensus = consensus;
    }

    getWinner(box: BallotBox<Vote>, winner: Vote, votes: number): Vote {
        return (votes >= this.consensus * box.ballots.length) ? winner : null;
    }

    placeVote(box: BallotBox<Vote>, index: number, vote: Vote): void {
        box.placeVote(index, vote);
    }
}
