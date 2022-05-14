import 'jest';
import BooleanBallotBox from "../../src/BooleanBallotBox";
import {Consensus} from "../../src/CountingStrategy";

let box: BooleanBallotBox;

describe("Testing 25% BooleanBallotBox", () => {
   beforeEach(() => {
      let strategy: Consensus<boolean> = new Consensus(0.25);
      box = new BooleanBallotBox(3, strategy);
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
      let strategy: Consensus<boolean> = new Consensus(0.5);
      box = new BooleanBallotBox(3, strategy);
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
      let strategy: Consensus<boolean> = new Consensus(1.0);
      box = new BooleanBallotBox(3, strategy);
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
