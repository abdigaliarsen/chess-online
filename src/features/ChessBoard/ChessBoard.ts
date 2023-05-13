import { Piece } from "../ChessBoard/Piece";
import { Coord } from "~/shared/Coord";
import { Checked, Colors, Pieces } from "~/shared/ChessTypes";

import { Bishop } from "./Pieces/Bishop";
import { King } from "./Pieces/King";
import { Knight } from "./Pieces/Knight";
import { Pawn } from "./Pieces/Pawn";
import { Queen } from "./Pieces/Queen";
import { Rook } from "./Pieces/Rook";

export class ChessBoard {
    private pieces: Piece[] = [];
    private totalMoves: number = 0;
    private checked: Checked = Checked.Neutral; // Checked by
    private attackCoords: Coord[][] = [];
    private attackPieces: Piece[] = [];

    private static instance: ChessBoard;

    public constructor() {
        this.restart();
    }

    public defaultSetup(): void {
        this.pieces = [];
        this.totalMoves = 0;
        this.checked = Checked.Neutral;

        this.attach(new Coord(0, 0), Pieces.Rook, Colors.Black);
        this.attach(new Coord(1, 0), Pieces.Knight, Colors.Black);
        this.attach(new Coord(2, 0), Pieces.Bishop, Colors.Black);
        this.attach(new Coord(3, 0), Pieces.Queen, Colors.Black);
        this.attach(new Coord(4, 0), Pieces.King, Colors.Black);
        this.attach(new Coord(5, 0), Pieces.Bishop, Colors.Black);
        this.attach(new Coord(6, 0), Pieces.Knight, Colors.Black);
        this.attach(new Coord(7, 0), Pieces.Rook, Colors.Black);

        for (let i = 0; i < 8; ++i)
            this.attach(new Coord(i, 1), Pieces.Pawn, Colors.Black);

        this.attach(new Coord(0, 7), Pieces.Rook, Colors.White);
        this.attach(new Coord(1, 7), Pieces.Knight, Colors.White);
        this.attach(new Coord(2, 7), Pieces.Bishop, Colors.White);
        this.attach(new Coord(3, 7), Pieces.Queen, Colors.White);
        this.attach(new Coord(4, 7), Pieces.King, Colors.White);
        this.attach(new Coord(5, 7), Pieces.Bishop, Colors.White);
        this.attach(new Coord(6, 7), Pieces.Knight, Colors.White);
        this.attach(new Coord(7, 7), Pieces.Rook, Colors.White);

        for (let i = 0; i < 8; ++i)
            this.attach(new Coord(i, 6), Pieces.Pawn, Colors.White);
    }

    public isPieceOnBoard(piece: Piece | undefined) {
        return piece !== undefined && !piece.getIsCaptured();
    }

    public isSafeForKing(coord: Coord, kingColor: Colors): boolean {
        let king = this.pieces.find(piece =>
            piece.getColor() === kingColor &&
            piece.getType() === Pieces.King
        );
        if (king === undefined || king.getIsCaptured())
            throw Error("not again...");

        // set king to captured to allow
        // enemy pieces to "move" through
        king.setCaptured();
        let safe = !this.pieces
            .filter(piece =>
                piece.getColor() !== kingColor &&
                piece.getType() !== Pieces.King
            )
            .map(piece => {
                if (piece.getType() === Pieces.Pawn)
                    return (piece as Pawn).getAttackMoves();
                return piece.getMoves();
            })
            .flat()
            .some(c => c.equals(coord));
        king.unsetCaptured();

        return safe;
    }

    public checkedBy(checkBy: Colors): Piece[] {
        let king = this.pieces.find(piece => piece.getColor() !== checkBy && piece.getType() === Pieces.King);
        if (king === undefined/* || king.getIsCaptured()*/)
            throw Error("WHY IS KING NOT ON THE BOARD??????");

        let kingCoord: Coord = king.getCoord();
        let pieces = this.pieces.filter(piece =>
            !piece.getIsCaptured() &&
            piece.getColor() === checkBy &&
            piece.getType() !== Pieces.King &&
            piece.getMoves().some(move => move.equals(kingCoord))
        );

        this.attackCoords = [];
        this.attackPieces = [];
        pieces.forEach(piece => {
            if (piece.getType() !== Pieces.Knight && piece.getType() !== Pieces.Pawn) {
                let x = piece.getCoord().getX(), y = piece.getCoord().getY();
                let dx = kingCoord.getX() - x,
                    dy = kingCoord.getY() - y;

                let stepX, stepY;
                let step = (d: number) => {
                    if (d > 0) return 1;
                    else if (d < 0) return -1;
                    return 0;
                }

                stepX = step(dx);
                stepY = step(dy);
                let ddx = stepX, ddy = stepY, coords = [];

                while (Coord.isValid(x + ddx, y + ddy)) {
                    coords.push(piece.getCoord().advance(ddx, ddy));
                    ddx += stepX;
                    ddy += stepY;
                }

                this.attackCoords.push(coords);
                this.attackPieces.push(piece);
            } else this.pieces.push(piece);
        });

        return pieces;
    }

    public attach(coord: Coord, type: Pieces, color: Colors): void {
        switch (type) {
            case Pieces.Bishop:
                this.pieces.push(new Bishop(coord, color));
                break;
            case Pieces.King:
                this.pieces.push(new King(coord, color));
                break;
            case Pieces.Knight:
                this.pieces.push(new Knight(coord, color));
                break;
            case Pieces.Pawn:
                this.pieces.push(new Pawn(coord, color));
                break;
            case Pieces.Queen:
                this.pieces.push(new Queen(coord, color));
                break;
            case Pieces.Rook:
                this.pieces.push(new Rook(coord, color));
                break;
        }
    }

    // TODO: improve this method to calculate a draw also
    // P.S.: if check is neutral and pieces with passed color do not have any move!!!!!!!
    // return true if passed color is lost
    public isMateFor(color: Colors): boolean {
        if (this.checked === Checked.Neutral)
            return false;
        if (this.checked === { ...Colors, ...Checked }[color]) {
            return false;
        }

        let pieces: Piece[] = this.pieces.filter(piece => piece.getColor() === color);
        let moves: Coord[] = pieces.map(piece => piece.getMoves()).flat();

        return moves.length === 0;
    }

    public restart(): void {
        this.pieces = [];
        this.totalMoves = 0;
        this.checked = Checked.Neutral;
        this.attackCoords = [];

        this.defaultSetup();
    }

    public getPiece(coord: Coord): Piece | undefined {
        return this.pieces.find(piece => piece.getCoord().equals(coord) && !piece.getIsCaptured());
    }

    public getPieces(): Piece[] {
        return this.pieces;
    }

    public getTotalMoves(): number {
        return this.totalMoves;
    }

    public incrementTotalMoves(): void {
        this.totalMoves += 1;
    }

    public setCheck(checkTo: Colors): void {
        this.checked = { ...Colors, ...Checked }[checkTo];
    }

    public unsetCheck(): void {
        this.checked = Checked.Neutral;
    }

    public getIsCheck(): Checked {
        return this.checked;
    }

    public getAttackCoords(): Coord[][] {
        return this.attackCoords;
    }

    public getAttackPieces(): Piece[] {
        return this.attackPieces;
    }

    public clearAttacks(): void {
        this.attackCoords = [];
    }

    public static getInstance(): ChessBoard {
        return this.instance || (this.instance = new ChessBoard());
    }
}