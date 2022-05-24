import 'jest';
import BooleanBallotBox from "../../src/ballot_boxes/BooleanBallotBox";
import {GlobalConsensus} from "../../src/counting_strategies/Consensus";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let strategy = new GlobalConsensus<boolean>(0.5);
let box1: BooleanBallotBox;
let box2: BooleanBallotBox;

describe("Testing the merging of Ballot Boxes", () => {
    beforeEach(() => {
        box1 = new BooleanBallotBox(3, strategy);
        box2 = new BooleanBallotBox(3, strategy);
    });

    it("checks that merged ballot boxes contain the same votes as each other", () => {
        box1.placeVote(0, true);
        box2.placeVote(1, true);

        box1.merge(box2);
        box2.merge(box1);
        expect(box1.votes).toEqual(box2.votes);
    });

    it("has correct vote summary after a merge", () => {
        box1.placeVote(0, true);
        box2.placeVote(1, true);

        box1.merge(box2);
        expect(box1.votes).toEqual([true, true, null]);
    });

    it("takes most recent votes in a merge", async () => {
        box1.placeVote(1, false);
        box2.placeVote(0, false);

        await sleep(3);

        box1.placeVote(0, true);
        box2.placeVote(1, true);

        box1.merge(box2);
        expect(box1.votes).toEqual([true, true, null]);
    });

    it("doesn't let people vote after box is closed", () => {
        box1.placeVote(0, true);
        box1.close();
        box1.placeVote(0, false);
        expect(box1.votes[0]).toBe(true);
    });
});
