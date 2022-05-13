class Ballot<Vote> {
    vote: Vote
    timestamp: number
    constructor(vote) {
        this.vote = vote;
        this.timestamp = Date.now();
    }
}

abstract class BallotBox<Vote> {
    votes: Array<Ballot<Vote>>
    abstract getWinner: () => Vote;

    constructor() {
        this.votes = []
    }

    merge(that) {
        for (let i = 0; i < this.votes.length; i++) {
            if (that.votes[i].timestamp > this.votes[i].timestamp) {
                this.votes[i] = that.votes[i];
            }
        }
    }
}

export default BallotBox;
