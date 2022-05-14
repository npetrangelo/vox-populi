import 'jest';
import MultipleChoiceBallotBox from "../../src/MultipleChoiceBallotBox";
import {VoterConsensus} from "../../src/ConsensusLevel";

let options = ["Alice", "Bob", "Charles"];
let box: MultipleChoiceBallotBox<string>;

describe("Testing VoterConsensus level", () => {
    beforeEach(() => {
        let strategy = new VoterConsensus<string>();
        box = new MultipleChoiceBallotBox<string>(5, strategy, options);
    });

    it("stops accepting new votes after it closes", () => {
        box.placeVote(0, "Alice");
        box.close();
    });

    it("lets the choice with the most votes win", () => {

    });
});
