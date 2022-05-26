import 'jest';
import MultipleChoiceBallotBox from "../../../src/ballot_boxes/MultipleChoiceBallotBox";
import {GlobalConsensus} from "../../../src/counting_strategies/Consensus";

let options = new Set(["Alice", "Bob", "Charles"]);
let strategy = new GlobalConsensus<string>(0.5);
let box: MultipleChoiceBallotBox<string>;

describe("Testing Multiple Choice Ballot Box", () => {
    beforeEach(() => {
        box = new MultipleChoiceBallotBox<string>(6, strategy, options);
    });

    it("says the winner is null in a tie", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Bob");
        let expected = new Map<string, string>([["A", "Alice"], ["B", "Bob"]]);
        expect(box.votes).toEqual(expected);
    });

    it("says there are 4 'Bob' votes", () => {
        box.placeVote("A", "Alice");
        box.placeVote("B", "Alice");
        box.placeVote("C", "Bob");
        box.placeVote("D", "Bob");
        box.placeVote("E", "Bob");
        box.placeVote("F", "Bob");
        let expected = new Map<string, string>([
            ["A", "Alice"], ["B", "Alice"],
            ["C", "Bob"], ["D", "Bob"], ["E", "Bob"], ["F", "Bob"]]);
        expect(box.votes).toEqual(expected);
    });
});
