// const { generateKeyPairSync, Sign } = await import('node:crypto');
//
// class EncryptedVote {
//     constructor(vote) {
//         const {publicKey, privateKey} = generateKeyPairSync('rsa', {});
//     }
// }

class Ballot<Vote> {
    vote: Vote
    timestamp: number
    constructor(vote) {
        this.vote = vote;
        this.timestamp = Date.now();
    }
}

export abstract class BallotBox<Vote> {
    votes: Array<Ballot<Vote>>
    protected constructor(size: number) {
        this.votes = new Array<Ballot<Vote>>(size);
    }

    placeVote(index: number, vote: Vote) {
        this.votes[index] = new Ballot<Vote>(vote);
    }

    protected abstract getWinner(): Vote;

    merge(that) {
        for (let i = 0; i < this.votes.length; i++) {
            if (that.votes[i].timestamp > this.votes[i].timestamp) {
                this.votes[i] = that.votes[i];
            }
        }
    }
}

export abstract class ClosableBallotBox<Vote> extends BallotBox<Vote> {
    isOpen: boolean
    protected constructor(size: number) {
        super(size);
        this.isOpen = true;
    }

    override placeVote(index: number, vote: Vote) {
        if (this.isOpen) super.placeVote(index, vote);
    }

    close(): Vote {
        this.isOpen = false;
        return this.getWinner();
    }
}

export abstract class ConsensusBallotBox<Vote> extends BallotBox<Vote> {
    consensus: number
    protected constructor(size: number, consensus: number) {
        super(size);
        this.consensus = consensus;
    }

    protected abstract getWinningVotes(): [Vote, number];

    override getWinner(): Vote {
        let winningVotes = this.getWinningVotes();
        if (winningVotes == null) {
            return null;
        }
        let [winner, votes] = winningVotes;
        return (votes >= this.consensus * this.votes.length) ? winner : null;
    }
}
