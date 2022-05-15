import 'jest';
import MultipleChoiceBallotBox from "../../src/MultipleChoiceBallotBox";
import {Average, GlobalConsensus, VoterConsensus} from "../../src/CountingStrategy";

let options = ["Alice", "Bob", "Charles"];
let box: MultipleChoiceBallotBox<string>;

describe("Testing VoterConsensus level", () => {
    beforeEach(() => {
        let strategy = new VoterConsensus<string>(0.5);
        box = new MultipleChoiceBallotBox<string>(5, strategy, options);
    });

    it("returns null if there is a tie", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("lets the choice with the most votes win", () => {
        box.placeVote(0, "Alice");
        expect(box.getWinner()).toBe("Alice");
    });
});

describe("Testing GlobalConsensus level", () => {
    beforeEach(() => {
        let strategy = new GlobalConsensus<string>(0.5);
        box = new MultipleChoiceBallotBox<string>(6, strategy, options);
    });

    it("returns null if there aren't enough votes", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("returns null if there is a tie", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Alice");
        box.placeVote(3, "Bob");
        box.placeVote(4, "Bob");
        box.placeVote(5, "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("returns the candidate with enough votes and the most votes", () => {
        box.placeVote(0, "Alice");
        box.placeVote(1, "Alice");
        box.placeVote(2, "Alice");
        expect(box.getWinner()).toBe("Alice");
    });
});

let numOptions = [0, 1];
let avgBox: MultipleChoiceBallotBox<number>;

describe("Testing Average counting strategy", () => {
    beforeEach(() => {
        avgBox = new MultipleChoiceBallotBox<number>(2, new Average(), numOptions);
    });

    it("says the winner is 0.5", () => {
        avgBox.placeVote(0, 0);
        avgBox.placeVote(1, 1);
        expect(avgBox.getWinner()).toBe(0.5);
    });
})
