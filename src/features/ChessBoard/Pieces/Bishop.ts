import { Coord } from "~/shared/Coord";
import { Piece } from "../Piece";
import { Colors, Directions, Pieces } from "~/shared/ChessTypes";

export class Bishop extends Piece {
    constructor(coord: Coord, color: Colors) {
        super(coord, Pieces.Bishop, color);
    }

    public getMoves(flag: boolean = false): Coord[] {
        if (this.isCheck() && flag) {
            let coords: Coord[] = [];
            this.directions[Directions.Diagonal]
                ?.forEach(d => coords.push(...this.advancePiece(d[0], d[1])));
            return coords;
        }

        if (this.isCheck()) {
            return this.defendKing();
        }

        if (!flag) {
            let pinned = this.pinned();
            if (pinned[0])
                return pinned[1];
        }

        let coords: Coord[] = [];
        this.directions[Directions.Diagonal]
            ?.forEach(d => coords.push(...this.advancePiece(d[0], d[1], flag)));
        return coords;
    }
}