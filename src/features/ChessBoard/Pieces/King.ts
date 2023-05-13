import { ChessBoard } from "../ChessBoard";
import { Coord } from "~/shared/Coord";
import { Piece } from "../Piece";
import { Colors, Pieces, Checked } from "~/shared/ChessTypes";

export class King extends Piece {
    constructor(coord: Coord, color: Colors) {
        super(coord, Pieces.King, color);
    }

    private castleMoves(): Coord[] {
        let coords: Coord[] = [],
            y = this.getCoord().getY(),
            x = this.getCoord().getX();
        let rooks = [
            ChessBoard.getInstance().getPiece(new Coord(0, y)),
            ChessBoard.getInstance().getPiece(new Coord(7, y))
        ];

        rooks.forEach(rook => {
            if (!ChessBoard.getInstance().isPieceOnBoard(rook) || rook?.getMoveOrder() !== 0)
                return;

            let diff: number = x - rook.getCoord().getX(),
                from: number = Math.min(x, rook.getCoord().getX()) + 1,
                to: number = Math.max(x, rook.getCoord().getX()),
                empty: boolean = true;

            while (from < to) {
                if (ChessBoard.getInstance().getPiece(new Coord(from, y))) {
                    empty = false;
                    break;
                }

                from += 1;
            }

            if (empty)
                coords.push(this.getCoord().advance(-Math.floor(diff - diff / 2), 0));
        });

        return coords;
    }

    private castle(rookX: number): void {
        let x = this.getCoord().getX(),
            y = this.getCoord().getY(),
            curRookPos: number,
            newRookPos: number;
        if (x - rookX > 0) {
            curRookPos = 0;
            newRookPos = 3;
        }
        else {
            curRookPos = 7;
            newRookPos = 5;
        }
        let rook = ChessBoard.getInstance().getPiece(new Coord(curRookPos, y));
        if (rook === undefined)
            throw Error("WTF???");

        rook.makeMove(new Coord(newRookPos, y));
    }

    private meetsKing(coord: Coord): boolean {
        let king = ChessBoard
            .getInstance()
            .getPieces()
            .find(piece =>
                piece.getType() === Pieces.King &&
                piece.getColor() !== this.getColor()
            );

        if (king === undefined)
            throw Error("WHY IS KING UNDEFINED???");
        let kingCoord = king.getCoord();
        return coord.getX() >= kingCoord.getX() - 1 && coord.getX() <= kingCoord.getX() + 1 &&
            coord.getY() >= kingCoord.getY() - 1 && coord.getY() <= kingCoord.getY() + 1;
    }

    public getMoves(pierce: boolean = false): Coord[] {
        let coords: Coord[] = [],
            x = this.getCoord().getX(),
            y = this.getCoord().getY();

        let dxs = [-1, 0, 1], dys = [-1, 0, 1];
        dxs.forEach(dx => {
            dys.forEach(dy => {
                if (dx === 0 && dy === 0) return;

                if (!Coord.isValid(x + dx, y + dy))
                    return;

                let coord = this.getCoord().advance(dx, dy);
                if (this.meetsKing(coord))
                    return;

                let piece = ChessBoard.getInstance().getPiece(coord);
                let valid =
                    // check if empty sqaure is not attacked
                    (!ChessBoard.getInstance().isPieceOnBoard(piece) &&
                        ChessBoard.getInstance()
                            .isSafeForKing(coord, this.getColor())) ||
                    // or check if the enemy piece is not defended
                    (piece !== undefined &&
                        ((piece.getColor() !== this.getColor() &&
                            !piece.isDefended()) ||
                            (piece.getColor() === this.getColor() && pierce)));

                if (valid)
                    coords.push(coord);
            });
        });

        if (this.getMoveOrder() === 0 && ChessBoard.getInstance().getIsCheck() === Checked.Neutral)
            coords.push(...this.castleMoves());

        return coords;
    }

    public makeMove(coord: Coord): void {
        let piece = ChessBoard.getInstance().getPiece(coord);
        if (piece !== undefined)
            piece.setCaptured();

        if (Math.abs(this.getCoord().getX() - coord.getX()) > 1)
            this.castle(coord.getX());

        this.getCoord().setCoord(coord);

        ChessBoard.getInstance().incrementTotalMoves();
        this.setMoveOrder();
        ChessBoard.getInstance().clearAttacks();

        if (ChessBoard.getInstance().checkedBy(this.getColor()).length !== 0)
            ChessBoard.getInstance().setCheck(this.getColor());
        else ChessBoard.getInstance().unsetCheck();
    }
}