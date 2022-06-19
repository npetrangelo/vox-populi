class Histogram {
    readonly map: Map<any, number>
    constructor(votes?: Array<any>) {
        this.map = new Map<any, number>();
        if (votes) {
            this.addList(votes);
        }
    }

    get size(): number {
        return this.map.size;
    }

    get(vote: any): number {
        if (!this.map.has(vote)) {
            return 0;
        }
        return this.map.get(vote);
    }

    add(vote: any) {
        this.map.set(vote, this.get(vote) + 1);
    }

    addList(votes: Array<any>) {
        for (let vote of votes) {
            this.add(vote);
        }
    }

    subtract(vote: any) {
        if (!this.map.has(vote)) {
            return;
        }
        this.map.set(vote, this.map.get(vote) - 1);
        if (this.map.get(vote) == 0) {
            this.map.delete(vote);
        }
    }

    subtractList(votes: Array<any>) {
        for (let vote of votes) {
            this.subtract(vote);
        }
    }

    topN(n?: number): Array<[any, number]> {
        let top = Array.from(this.map.entries()).sort((a, b) => b[1] - a[1]);
        if (!n) {
            return top;
        }
        return top.slice(0, n);
    }
}

export default Histogram;
