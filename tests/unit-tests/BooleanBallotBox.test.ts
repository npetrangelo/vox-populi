import 'jest';
import BooleanBallotBox from "../../src/BooleanBallotBox";
import {GlobalConsensus} from "../../src/ConsensusLevel";

let box: BooleanBallotBox;

describe("Testing 25% BooleanBallotBox", () => {
   beforeEach(() => {
      let strategy: GlobalConsensus<boolean> = new GlobalConsensus();
      box = new BooleanBallotBox(3, 0.25, strategy);
   });

   it("returns false when there aren't enough votes", async () => {
      box.placeVote(0, false);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(null);
   });

   it("returns true when there are enough votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(true);
   });
});

describe("Testing 50% BooleanBallotBox", () => {
   beforeEach(() => {
      let strategy: GlobalConsensus<boolean> = new GlobalConsensus();
      box = new BooleanBallotBox(3, 0.5, strategy);
   });

   it("returns false when there aren't enough votes", async () => {
      box.placeVote(0, true);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(null);
   });

   it("returns true when there are enough votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(true);
   });
});

describe("Testing 100% BooleanBallotBox", () => {
   beforeEach(() => {
      let strategy: GlobalConsensus<boolean> = new GlobalConsensus();
      box = new BooleanBallotBox(3, 1.0, strategy);
   });

   it("returns false when there aren't enough votes", async () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, false);
      expect(box.getWinner()).toBe(null);
   });

   it("returns true when there are enough votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, true);
      box.placeVote(2, true);
      expect(box.getWinner()).toBe(true);
   });
});
