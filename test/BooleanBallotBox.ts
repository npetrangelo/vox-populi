import { describe, before, beforeEach, it, after } from "mocha";
import { expect } from "chai";
import BooleanBallotBox from "../src/BooleanBallotBox";

let box = new BooleanBallotBox(3, 0.5);

describe("Testing BooleanBallotBox", () => {
   before(() => {
      console.log("Starting tests");
   });

   beforeEach(() => {
      box = new BooleanBallotBox(3, 0.5);
   });

   it("returns false when there aren't enough votes", () => {
      box.placeVote(0, true);
      box.placeVote(1, false);
      box.placeVote(2, false);
      expect(0).to.equal(0);
      // console.log(foo);
   });

   it("returns true when there are enough votes", () => {

   });

   after(() => {
      console.log("Ending tests");
   });
});
