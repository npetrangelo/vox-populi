import 'jest';
import MultipleChoiceBallotBox from "../../src/ballot_boxes/MultipleChoiceBallotBox";
import {GlobalConsensus} from "../../src/counting_strategies/Consensus";

let options = ["Alice", "Bob", "Charles"];
let strategy = new GlobalConsensus<string>(0.5);
let box: MultipleChoiceBallotBox<string>;

describe("Testing 50% Multiple Choice Ballot Box", () => {
    beforeEach(() => {
        box = new MultipleChoiceBallotBox<string>(6, strategy, options);
    });

    it("says the winner is null in a tie", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Bob");
        expect(box.getWinningVotes()).toEqual([null, 1]);
    });

    it("says there are 4 'Bob' votes", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Bob");
        box.placeVote(3, "Bob");
        box.placeVote(4, "Bob");
        box.placeVote(5, "Bob");
        expect(box.getWinningVotes()).toEqual(["Bob", 4]);
    });
});
