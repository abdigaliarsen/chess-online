import { ChessBoard } from "../ChessBoard";
import { Coord } from "~/shared/Coord";
import { Piece } from "../Piece";
import { Colors, Pieces } from "~/shared/ChessTypes";

export class Pawn extends Piece {
    private step: number;
    private baseY: number;
    private doubleStep: number;
    private enPassantPosition: number;

    constructor(coord: Coord, color: Colors) {
        super(coord, Pieces.Pawn, color);
        if (this.getColor() === Colors.White) {
            this.step = -1;
            this.baseY = 6;
            this.doubleStep = -2;
            this.enPassantPosition = 3;
        } else {
            this.step = 1;
            this.baseY = 1;
            this.doubleStep = 2;
            this.enPassantPosition = 4;
        }
    }

    public attack(): Coord[] {
        let coords: Coord[] = [],
            x = this.getCoord().getX(),
            y = this.getCoord().getY(),
            dxs: [number, number] = [-1, 1];

        dxs.forEach(dx => {
            let piece: Piece | undefined;
            if (Coord.isValid(x + dx, y + this.step))
                piece = ChessBoard.getInstance().getPiece(this.getCoord().advance(dx, this.step));

            if (piece !== undefined &&
                piece.getColor() !== this.getColor() &&
                !piece.getIsCaptured())
                coords.push(piece.getCoord());
        });

        return coords;
    }

    private enPassant(): Coord[] {
        let coords: Coord[] = [],
            x = this.getCoord().getX(),
            y = this.getCoord().getY(),
            dxs: [number, number] = [-1, 1];

        coords = this.attack();
        dxs.forEach(dx => {
            if (coords.length === 0 && y === this.enPassantPosition) {
                let piece: Piece | undefined;
                if (Coord.isValid(x + dx, y))
                    piece = ChessBoard.getInstance().getPiece(new Coord(x + dx, y));

                if (piece !== undefined && piece.getType() === Pieces.Pawn &&
                    piece.getMoveOrder() === ChessBoard.getInstance().getTotalMoves())
                    coords.push(this.getCoord().advance(dx, this.step));
            }
        });

        return coords;
    }

    public getAttackMoves(): Coord[] {
        let moves: [[number, number], [number, number]] =
            [[-1, this.step], [1, this.step]];
        let coords: Coord[] = [];
        moves.forEach(move => {
            if (Coord.isValid(this.getCoord().getX() + move[0], this.getCoord().getY() + move[1]))
                coords.push(this.getCoord().advance(move[0], move[1]));
        });

        return coords;
    }

    public getSteps(): Coord[] {
        let coords: Coord[] = [],
            x = this.getCoord().getX(),
            y = this.getCoord().getY();

        if (Coord.isValid(x, y + this.step)) {
            let fPiece = ChessBoard.getInstance().getPiece(this.getCoord().advance(0, this.step));
            if (!ChessBoard.getInstance().isPieceOnBoard(fPiece))
                coords.push(this.getCoord().advance(0, this.step));
        }

        if (y === this.baseY) {
            let ffPiece = ChessBoard.getInstance().getPiece(this.getCoord().advance(0, this.doubleStep));
            if (!ChessBoard.getInstance().isPieceOnBoard(ffPiece))
                coords.push(this.getCoord().advance(0, this.doubleStep));
        }

        return coords;
    }

    public getMoves(flag: boolean = false): Coord[] {
        if (this.isCheck() && flag) {
            return this.getSteps();
        }

        if (this.isCheck()) {
            return this.defendKing();
        }

        if (!flag) {
            let pinned = this.pinned();
            if (pinned[0])
                return pinned[1];
        }


        return [...this.getSteps(), ...this.enPassant()];
    }

    public makeMove(coord: Coord): void {
        let x = this.getCoord().getX(),
            y = this.getCoord().getY(),
            piece = ChessBoard.getInstance().getPiece(coord);

        if (piece !== undefined)
            piece.setCaptured();
        else if (!ChessBoard.getInstance().isPieceOnBoard(piece) && Math.abs(x - coord.getX()) === 1) {
            let dx = coord.getX() - x;
            if (y === this.enPassantPosition && Coord.isValid(x + dx, y)) {
                let piece = ChessBoard.getInstance().getPiece(this.getCoord().advance(dx, 0));
                if (piece !== undefined && piece.getType() === Pieces.Pawn &&
                    piece.getMoveOrder() === ChessBoard.getInstance().getTotalMoves())
                    piece.setCaptured();
            }
        }

        this.getCoord().setCoord(coord);

        ChessBoard.getInstance().incrementTotalMoves();
        this.setMoveOrder();

        if (ChessBoard.getInstance().checkedBy(this.getColor()).length !== 0)
            ChessBoard.getInstance().setCheck(this.getColor());
        else ChessBoard.getInstance().unsetCheck();
    }
}