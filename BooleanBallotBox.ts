import BallotBox from "./vote";

class BooleanBallotBox extends BallotBox<boolean | null> {
    getWinner = (): boolean => {
        let value = 0;
        this.votes.forEach((ballot) => {
            if (ballot.vote == null) return;
            value += (ballot.vote) ? 1 : -1;
        });
        if (value == 0) return null;
        return value > 0;
    };
}

export default BooleanBallotBox;
