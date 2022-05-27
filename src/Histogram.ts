class Histogram<Vote> {
    readonly map: Map<Vote, number>
    constructor(votes?: Array<Vote>) {
        this.map = new Map<Vote, number>();
        if (votes) {
            for (let vote of votes) {
                this.add(vote);
            }
        }
    }

    get size(): number {
        return this.map.size;
    }

    get(vote: Vote): number {
        if (!this.map.has(vote)) {
            return 0;
        }
        return this.map.get(vote);
    }

    add(vote: Vote) {
        this.map.set(vote, this.get(vote) + 1);
    }

    subtract(vote: Vote) {
        if (!this.map.has(vote)) {
            return;
        }
        this.map.set(vote, this.map.get(vote) - 1);
        if (this.map.get(vote) == 0) {
            this.map.delete(vote);
        }
    }

    topN(n: number): Array<[Vote, number]> {
        return Array.from(this.map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
    }
}

export default Histogram;
