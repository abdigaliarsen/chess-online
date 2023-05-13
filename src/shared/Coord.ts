export class Coord {
    private x: number = -100;
    private y: number = -100;

    constructor(x?: number, y?: number) {
        if (x !== undefined && y !== undefined) {
            if ((x < 0 || x > 7 || y < 0 || y > 7) && x !== -1 && y !== -1)
                throw new Error('Invalid piece coordinate');

            this.x = x;
            this.y = y;
        }
    }

    public equals(coord: Coord) {
        return coord.x === this.x && coord.y === this.y;
    }

    public setCoord(coord: Coord): void {
        this.x = coord.x;
        this.y = coord.y;
    }

    public advance(dx: number, dy: number): Coord {
        return new Coord(this.x + dx, this.y + dy);
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public static isValid(x: number, y: number) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
}