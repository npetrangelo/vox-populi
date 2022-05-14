import 'jest';
import BooleanBallotBox from "../../src/BooleanBallotBox";
import {BallotBox} from "../../src/vote";
import {GlobalConsensus} from "../../src/ConsensusLevel";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let box1: BooleanBallotBox;
let box2: BooleanBallotBox;

describe("Testing the merging of Ballot Boxes", () => {
    beforeEach(() => {
        let level = new GlobalConsensus<boolean>();
        box1 = new BooleanBallotBox(3, 0.5, level);
        box2 = new BooleanBallotBox(3, 0.5, level);
    });

    it("checks that merged ballot boxes contain the same votes as each other", async () => {
        box1.placeVote(0, true);
        box2.placeVote(1, true);

        box1.merge(box2);
        box2.merge(box1);
        expect(box1.votes).toEqual(box2.votes);
    });

    it("checks votes after a merge", async () => {
        box1.placeVote(0, true);
        box2.placeVote(1, true);

        box1.merge(box2);
        let expected = [true, true, null];
        expect(box1.votes).toEqual(expected);
    });

    it("doesn't let people vote after box is closed", () => {
        box1.placeVote(0, true);
        box1.close();
        box1.placeVote(0, false);
        expect(box1.votes[0]).toBe(true);
    });
});
