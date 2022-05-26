import 'jest';
import {GlobalConsensus, VoterConsensus} from "../../../src/counting_strategies/Consensus";
import {BallotBox} from "../../../src/ballot_boxes/BallotBox";

let box: BallotBox<string>;

describe("Testing VoterConsensus level", () => {
    beforeEach(() => {
        let strategy = new VoterConsensus<string>(0.5);
        box = new BallotBox<string>(5, strategy);
    });

    it("returns null if there is a tie", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("lets the choice with the most votes win", () => {
        box.placeVote("A", "Alice");
        expect(box.getWinner()).toBe("Alice");
    });
});

describe("Testing GlobalConsensus level", () => {
    beforeEach(() => {
        let strategy = new GlobalConsensus<string>(0.5);
        box = new BallotBox<string>(6, strategy);
    });

    it("returns null if there aren't enough votes", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("returns null if there is a tie", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Alice");
        box.placeVote("C", "Alice");
        box.placeVote("D", "Bob");
        box.placeVote("E", "Bob");
        box.placeVote("F", "Bob");
        expect(box.getWinner()).toBe(null);
    });

    it("returns the candidate with enough votes and the most votes", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Alice");
        box.placeVote("C", "Alice");
        expect(box.getWinner()).toBe("Alice");
    });
});
