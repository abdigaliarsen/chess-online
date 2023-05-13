import { ChessBoard } from "../ChessBoard";
import { Coord } from "~/shared/Coord";
import { Piece } from "../Piece";
import { Colors, Pieces } from "~/shared/ChessTypes";

export class Knight extends Piece {
    constructor(coord: Coord, color: Colors) {
        super(coord, Pieces.Knight, color);
    }

    public getMoves(flag: boolean = false): Coord[] {
        if (this.isCheck() && flag) {
            let x: number = this.getCoord().getX(),
                y: number = this.getCoord().getY(),
                steps: number[] = [-2, -1, 1, 2],
                coords: Coord[] = [];

            steps.forEach(dx => {
                steps.forEach(dy => {
                    if (Math.abs(dx) !== Math.abs(dy) && Coord.isValid(x + dx, y + dy)) {
                        let piece = ChessBoard.getInstance().getPiece(new Coord(x + dx, y + dy));
                        if (piece === undefined ||
                            piece.getIsCaptured() ||
                            piece.getColor() !== this.getColor())
                            coords.push(new Coord(x + dx, y + dy));
                    }
                });
            });

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

        let x: number = this.getCoord().getX(),
            y: number = this.getCoord().getY(),
            steps: number[] = [-2, -1, 1, 2],
            coords: Coord[] = [];

        steps.forEach(dx => {
            steps.forEach(dy => {
                if (Math.abs(dx) !== Math.abs(dy) && Coord.isValid(x + dx, y + dy)) {
                    let piece = ChessBoard.getInstance().getPiece(new Coord(x + dx, y + dy));
                    if (piece === undefined ||
                        piece.getIsCaptured() ||
                        piece.getColor() !== this.getColor() ||
                        (piece.getColor() === this.getColor() && flag))
                        coords.push(new Coord(x + dx, y + dy));
                }
            });
        });

        return coords;
    }
}