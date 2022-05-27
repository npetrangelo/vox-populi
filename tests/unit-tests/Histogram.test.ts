import 'jest';
import Histogram from "../../src/Histogram";

let histogram: Histogram<string>;

describe("Testing Histogram", () => {
    beforeEach(() => {
        histogram = new Histogram<string>();
    });

    it("gets zero for anything not in the histogram", () => {
        expect(histogram.get("A")).toEqual(0);
    });

    it("adds to and subtracts from histogram", () => {
        histogram.add("A");
        expect(histogram.get("A")).toEqual(1);
        histogram.subtract("A");
        expect(histogram.get("A")).toEqual(0);
    });

    it("subtracts nothing when histogram doesn't contain value", () => {
        histogram.subtract("A");
        expect(histogram.get("A")).toEqual(0);
    });
});
