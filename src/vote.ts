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

abstract class BallotBox<Vote> {
    votes: Array<Ballot<Vote>>
    abstract getWinner: () => Vote;

    protected constructor(size: number) {
        this.votes = new Array<Ballot<Vote>>(size);
    }

    placeVote(index: number, vote: Vote) {
        this.votes[index] = new Ballot<Vote>(vote);
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
