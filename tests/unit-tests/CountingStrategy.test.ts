import 'jest';
import {
    Average,
    Plurality,
    Consensus,
    Consent, Quorum
} from "../../src/CountingStrategy";
import {BallotBox} from "../../src/BallotBox";

let box: BallotBox;

describe("Testing Type Predicates", () => {
    it("returns false when object doesn't have threshold", () => {
        let object: any = {"banana": 0.5};
        expect(Consensus.check(object)).toBe(false);
        expect(Consent.check(object)).toBe(false);
        expect(Quorum.check(object)).toBe(false);
    });

    it("returns false when threshold is not a number", () => {
        let object: any = {"threshold": "0.5"};
        expect(Consensus.check(object)).toBe(false);
        expect(Consent.check(object)).toBe(false);
        expect(Quorum.check(object)).toBe(false);
    });

    it("returns true when object has threshold", () => {
        let object: any = {"threshold": 0.5};
        expect(Consensus.check(object)).toBe(true);
        expect(Consent.check(object)).toBe(true);
    });

    it("returns false when ifEnough is not an object", () => {
        let object: any = {"ifEnough":0.5,"threshold":0.5}
        expect(Quorum.check(object)).toBe(false);
    });

    it("returns true when object has threshold and ifEnough", () => {
        let object: any = {"ifEnough":{"threshold":0.5},"threshold":0.5}
        expect(Quorum.check(object)).toBe(true);
    });
});

describe("Testing Plurality", () => {
    beforeEach(() => {
       box = new BallotBox(2, new Plurality());
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
        box = new BallotBox(6, new Plurality(0.5));
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
        let strategy = new Consensus(0.75);
        box = new BallotBox(6, strategy);
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
        let strategy = new Consent(0.5);
        box = new BallotBox(6, strategy);
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
        let strategy = new Quorum(0.5, new Plurality());
        box = new BallotBox(2, strategy);
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
        box = new BallotBox(2, new Average());
    });

    it("only allows numerical votes", () => {
        expect(box.strategy.canCount(1)).toBe(true);
        expect(box.strategy.canCount("foo")).toBe(false);
        expect(() => box.placeVote("A", "foo")).toThrow("vote is not the right type");
    });

    it("says the winner is 0.5", () => {
        box.placeVote("A", 0);
        box.placeVote("B", 1);
        expect(box.getWinner()).toBe(0.5);
    });
})
