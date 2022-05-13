import 'jest';
import BooleanBallotBox from "../../src/BooleanBallotBox";

let box = new BooleanBallotBox(3, 0.5);

describe("Testing BooleanBallotBox", () => {
   beforeEach(() => {
      box = new BooleanBallotBox(3, 0.5);
   });

   it("returns false when there aren't enough votes", async () => {
      box.placeVote(0, true);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(false);
   });

   it("returns true when there are enough votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(true);
   });
});
