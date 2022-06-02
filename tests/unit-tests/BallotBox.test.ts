import 'jest';
import {BallotBox} from "../../src/BallotBox";
import Histogram from "../../src/Histogram";
import {Consensus} from "../../src/CountingStrategy";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let strategy = new Consensus<boolean>(0.5);
let box1: BallotBox<boolean>;
let box2: BallotBox<boolean>;

describe("Testing the merging of Ballot Boxes", () => {
    beforeEach(() => {
        box1 = new BallotBox<boolean>(3, strategy);
        box2 = new BallotBox<boolean>(3, strategy);
    });

    it("checks that merged ballot boxes contain the same votes as each other", () => {
        box1.placeVote("A", true);
        box2.placeVote("B", true);

        box1.merge(box2);
        box2.merge(box1);
        expect(box1.votes).toEqual(box2.votes);
        expect(box1.histogram).toEqual(box2.histogram);
    });

    it("has correct histogram after a merge", () => {
        box1.placeVote("A", true);
        box2.placeVote("B", true);

        box1.merge(box2);
        let expected = new Histogram<boolean>([true, true]);
        expect(box1.histogram).toEqual(expected);
    });

    it("takes most recent votes in a merge", async () => {
        box1.placeVote("B", false);
        box2.placeVote("A", false);

        await sleep(3);

        box1.placeVote("A", true);
        box2.placeVote("B", true);

        box1.merge(box2);
        let expected = new Histogram<boolean>([true, true]);
        expect(box1.histogram).toEqual(expected);
    });

    it("lets people override votes", () => {
        box1.placeVote("A", true);
        box1.placeVote("A", false);
        expect(box1.votes.get("A")).toBe(false);
        let expected = new Histogram<boolean>([false]);
        expect(box1.histogram).toEqual(expected);
    });

    it("doesn't let people vote after box is closed", () => {
        box1.placeVote("A", true);
        box1.close();
        box1.placeVote("A", false);
        expect(box1.votes.get("A")).toBe(true);
    });
});
