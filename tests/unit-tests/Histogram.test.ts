import 'jest';
import Histogram from "../../src/Histogram";

let histogram: Histogram<string>;

describe("Testing Histogram", () => {
    beforeEach(() => {
        histogram = new Histogram<string>();
    });

    it("gets the right size", () => {
        expect(histogram.size).toEqual(0);
        histogram.add("A");
        expect(histogram.size).toEqual(1);
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

    it("takes the top N entries in the histogram", () => {
        histogram.add("A");
        histogram.add("A");
        histogram.add("A");
        histogram.add("B");
        histogram.add("B");
        histogram.add("C");
        expect(histogram.topN(2)).toEqual([["A", 3], ["B", 2]]);
    });
});
