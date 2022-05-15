import 'jest';
import BooleanBallotBox from "../../src/BooleanBallotBox";
import {GlobalConsensus} from "../../src/ConsensusLevel";

let strategy = new GlobalConsensus<boolean>(0.5);
let box: BooleanBallotBox;

describe("Testing BooleanBallotBox", () => {
   beforeEach(() => {
      box = new BooleanBallotBox(3, strategy);
   });

   it("says there are no true votes", async () => {
      box.placeVote(0, false);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinningVotes()).toEqual([true, 0, 3]);
   });

   it("says there is 1 true votes", async () => {
      box.placeVote(0, true);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinningVotes()).toEqual([true, 1, 3]);
   });

   it("says there are 2 true votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, false);
      expect(box.getWinningVotes()).toEqual([true, 2, 3]);
   });

   it("says there are 3 true votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, true);
      expect(box.getWinningVotes()).toEqual([true, 3, 3]);
   });
});
