import 'jest';
import {
    Average,
    Plurality,
    Consensus,
    Consent, Quorum
} from "../../src/CountingStrategy";
import {BallotBox} from "../../src/BallotBox";

let box: BallotBox<number>;

describe("Testing Plurality", () => {
    beforeEach(() => {
       box = new BallotBox<number>(2, new Plurality());
    });

    it("lets the option with the most votes win", () => {
       box.placeVote("A", 0);
       expect(box.getWinner()).toBe(0);
    });

    it("returns null in case of tie", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 1)
        expect(box.getWinner()).toBe(null);
    });
});

describe("Testing Plurality with threshold", () => {
    beforeEach(() => {
        box = new BallotBox<number>(6, new Plurality(0.5));
    });

    it("returns null below threshold", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 0);
        box.placeVote("C", 1);
        box.placeVote("D", 2);
        box.placeVote("E", 3);
        box.placeVote("F", 4);
        expect(box.getWinner()).toBe(null);
    });

    it("returns the winner above threshold", () => {
        box.placeVote("A", 0);
        expect(box.getWinner()).toBe(0);
    });
});

describe("Testing Consensus", () => {
    beforeEach(() => {
        let strategy = new Consensus<number>(0.75);
        box = new BallotBox<number>(6, strategy);
    });

    it("returns the candidate with enough votes and the most votes", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 0);
        box.placeVote("C", 0);
        box.placeVote("D", 0);
        expect(box.getWinner()).toBe(null);
    });

    it("makes an option fail when fewer than the threshold vote for it", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 0);
        box.placeVote("C", 0);
        box.placeVote("D", 0);
        box.placeVote("E", 0);
        expect(box.getWinner()).toBe(0);
    });
});

describe("Testing Consent", () => {
    beforeEach(() => {
        let strategy = new Consent<number>(0.5);
        box = new BallotBox<number>(6, strategy);
    });

    it("lets an option pass when fewer than the threshold vote against it", () => {
        box.placeVote("A", 0);
        expect(box.getWinner()).toBe(0);
    });

    it("makes an option lose when more than the threshold vote against it", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 1);
        box.placeVote("C", 2);
        box.placeVote("D", 3);
        expect(box.getWinner()).toBe(null);
    });
});

describe("Testing Quorum", () => {
    beforeEach(() => {
        let strategy = new Quorum<number>(0.5, new Plurality<number>());
        box = new BallotBox<number>(2, strategy);
    });

    it("returns null below quorum", () => {
        box.placeVote("A", 0);
        expect(box.getWinner()).toBe(null);
    });

    it("returns plurality above quorum", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 0);
        expect(box.getWinner()).toBe(0);
    });
});

describe("Testing Average counting strategy", () => {
    beforeEach(() => {
        box = new BallotBox<number>(2, new Average());
    });

    it("says the winner is 0.5", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 1);
        expect(box.getWinner()).toBe(0.5);
    });
})
