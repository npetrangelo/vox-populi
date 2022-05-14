import 'jest';
import MultipleChoiceBallotBox from "../../src/MultipleChoiceBallotBox";
import {GlobalConsensus} from "../../src/ConsensusLevel";

let options = ["Alice", "Bob", "Charles"];
let box: MultipleChoiceBallotBox<string>;

describe("Testing 50% Multiple Choice Ballot Box", () => {
    beforeEach(() => {
        let strategy: GlobalConsensus<string> = new GlobalConsensus();
        box = new MultipleChoiceBallotBox<string>(6, 0.5, strategy, options);
    });

    it("returns null when the winner doesn't have enough votes", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Bob");
        box.placeVote(3, "Bob");
        box.placeVote(4, "Charles");
        box.placeVote(5, "Charles");
        expect(box.getWinner()).toBe(null);
    });

    it("returns winner when the winner has enough votes", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Bob");
        box.placeVote(3, "Bob");
        box.placeVote(4, "Bob");
        box.placeVote(5, "Bob");
        expect(box.getWinner()).toBe("Bob");
    });

    it("returns null when the winners are tied", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Alice");
        box.placeVote(3, "Bob");
        box.placeVote(4, "Bob");
        box.placeVote(5, "Bob");
        expect(box.getWinner()).toBe(null);
    });
});
