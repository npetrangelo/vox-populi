import BallotBox from "./vote";

class MultipleChoiceBallotBox<Choice> extends BallotBox<Choice> {
    threshold: number
    options: Array<Choice>
    constructor(size: number, threshold: number, options: Array<Choice>) {
        super(size);
        this.threshold = threshold;
        this.options = options;
    }

    getWinner = (): Choice => {
        let options = new Map<Choice, number>(this.options.map((v, i) => [v, 0]));
        this.votes.forEach((ballot, index) => {
            if (!options.has(ballot.vote)) {
                // TODO Error
            }
            options.set(ballot.vote, options.get(ballot.vote) + 1);
        });
        let results: Array<[Choice, number]> = Array.from(options.entries())
            .sort(([c1, n1], [c2, n2]) => {
                return n2 - n1;
            });

        if (results[0][1] == results[1][1]) {
            return null;
        }

        let winner: [Choice, number] = results[0];
        return (winner[1] >= (this.threshold * this.votes.length)) ? winner[0] : null;
    }
}

export default MultipleChoiceBallotBox;
