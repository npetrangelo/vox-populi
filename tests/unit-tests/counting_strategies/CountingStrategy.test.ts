import 'jest';
import {Average} from "../../../src/counting_strategies/CountingStrategy";
import {BallotBox} from "../../../src/ballot_boxes/BallotBox";

let avgBox: BallotBox<number>;

describe("Testing Average counting strategy", () => {
    beforeEach(() => {
        avgBox = new BallotBox<number>(2, new Average());
    });

    it("says the winner is 0.5", () => {
        avgBox.placeVote("A", 0);
        avgBox.placeVote("B", 1);
        expect(avgBox.getWinner()).toBe(0.5);
    });
})
