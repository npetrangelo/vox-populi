import 'jest';
import BooleanBallotBox from "../../../src/ballot_boxes/BooleanBallotBox";
import {GlobalConsensus} from "../../../src/counting_strategies/Consensus";

let strategy = new GlobalConsensus<boolean>(0.5);
let box: BooleanBallotBox;

describe("Testing BooleanBallotBox", () => {
   beforeEach(() => {
      box = new BooleanBallotBox(3, strategy);
   });

   it("says there are no true votes", async () => {
      box.placeVote("A", false);
      box.placeVote("B", false);
      box.placeVote("C", false);
      let expected = new Map<string, boolean>([["A", false], ["B", false], ["C", false]]);
      expect(box.votes).toEqual(expected);
   });

   it("says there is 1 true votes", async () => {
      box.placeVote("A", true);
      box.placeVote("B", false);
      box.placeVote("C", false);
      let expected = new Map<string, boolean>([["A", true], ["B", false], ["C", false]]);
      expect(box.votes).toEqual(expected);
   });

   it("says there are 2 true votes", () => {
      box.placeVote("A", true);
      box.placeVote("B", true);
      box.placeVote("C", false);
      let expected = new Map<string, boolean>([["A", true], ["B", true], ["C", false]]);
      expect(box.votes).toEqual(expected);
   });

   it("says there are 3 true votes", () => {
      box.placeVote("A", true);
      box.placeVote("B", true);
      box.placeVote("C", true);
      let expected = new Map<string, boolean>([["A", true], ["B", true], ["C", true]]);
      expect(box.votes).toEqual(expected);
   });
});
