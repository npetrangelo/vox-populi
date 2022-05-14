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
    ballots: Array<Ballot<Vote>>
    protected constructor(size: number) {
        this.ballots = new Array<Ballot<Vote>>(size);
        this.ballots.fill(null);
    }

    placeVote(index: number, vote: Vote) {
        this.ballots[index] = new Ballot<Vote>(vote);
    }

    protected abstract getWinner(): Vote;

    merge(that: BallotBox<Vote>) {
        for (let i = 0; i < this.ballots.length; i++) {
            if (that.ballots[i] == null) {
                continue;
            }

            if (this.ballots[i] == null) {
                this.ballots[i] = that.ballots[i];
                continue;
            }

            if (that.ballots[i].timestamp > this.ballots[i].timestamp) {
                this.ballots[i] = that.ballots[i];
            }
        }
    }

    get votes(): Array<Vote> {
        return this.ballots.map(ballot => {
            if (ballot == null) {
                return null;
            }
            return ballot.vote;
        });
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
        return (votes >= this.consensus * this.ballots.length) ? winner : null;
    }
}
