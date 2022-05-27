class Histogram<Vote> {
    private map: Map<Vote, number>
    constructor() {
        this.map = new Map<Vote, number>();
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
}

export default Histogram;
