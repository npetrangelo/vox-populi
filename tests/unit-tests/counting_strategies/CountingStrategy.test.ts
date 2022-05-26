import 'jest';
import MultipleChoiceBallotBox from "../../../src/ballot_boxes/MultipleChoiceBallotBox";
import {Average} from "../../../src/counting_strategies/CountingStrategy";

let numOptions = new Set([0, 1]);
let avgBox: MultipleChoiceBallotBox<number>;

describe("Testing Average counting strategy", () => {
    beforeEach(() => {
        avgBox = new MultipleChoiceBallotBox<number>(2, new Average(), numOptions);
    });

    it("says the winner is 0.5", () => {
        avgBox.placeVote("A", 0);
        avgBox.placeVote("B", 1);
        expect(avgBox.getWinner()).toBe(0.5);
    });
})
