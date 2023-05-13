import { ChessBoard } from "./ChessBoard";
import { Coord } from "~/shared/Coord";
import { Pawn } from "./Pieces/Pawn";
import { Checked, Colors, Directions, Pieces } from "~/shared/ChessTypes";

export abstract class Piece {
    private coord: Coord = new Coord(0, 0);
    private type: Pieces = Pieces.Pawn;
    private color: Colors = Colors.White;

    private moveOrder: number = 0;
    private isCaptured: boolean = false;

    protected directions: { [type in Directions]?: Array<[number, number]> } = {
        [Directions.Vertical]: [[0, 1], [0, -1], [1, 0], [-1, 0]],
        [Directions.Diagonal]: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
    };

    constructor(coord?: Coord, type?: Pieces, color?: Colors) {
        if (coord) this.coord = coord;
        if (type) this.type = type;
        if (color) this.color = color;
    }

    protected advancePiece(dx: number, dy: number, pierce: boolean = false): Coord[] {
        let x: number = this.coord.getX(), y: number = this.coord.getY(),
            coords: Coord[] = [];

        while (Coord.isValid(x + dx, y + dy)) {
            x += dx; y += dy;
            let piece = ChessBoard.getInstance().getPiece(new Coord(x, y));
            if (!ChessBoard.getInstance().isPieceOnBoard(piece))
                coords.push(new Coord(x, y));
            else if (piece?.color !== this.color) {
                coords.push(new Coord(x, y));
                break;
            } else if (piece.color === this.color) {
                if (pierce)
                    coords.push(new Coord(x, y));
                break;
            }
        }

        return coords;
    }

    protected isCheck(): boolean {
        return ChessBoard.getInstance().getIsCheck() !== Checked.Neutral &&
            ChessBoard.getInstance().getIsCheck() !== { ...Colors, ...Checked }[this.getColor()];
    }

    protected defendKing(): Coord[] {
        let attackCoords = ChessBoard.getInstance().getAttackCoords();
        let attackPieces = ChessBoard.getInstance().getAttackPieces();

        let coords = this.getMoves(true)
            .filter(coord => {
                return attackCoords.every(coords => coords.some(c => c.equals(coord))) ||
                    attackPieces.every(piece => piece.coord.equals(coord));
            });

        return coords;
    }

    public printCoord = (c: Coord) => `(${c.getX()}, ${c.getY()})`;

    public isDefended(): boolean {
        let friendPieces = ChessBoard.getInstance().getPieces()
            .filter(piece =>
                ChessBoard
                    .getInstance()
                    .isPieceOnBoard(piece) &&
                piece.getColor() === this.color
            );

        let prevCheck = ChessBoard.getInstance().getIsCheck();
        ChessBoard.getInstance().unsetCheck();

        let moves = friendPieces
            .map(piece => {
                if (piece.getType() === Pieces.Pawn)
                    return (piece as Pawn).getAttackMoves();
                else return piece.getMoves(true);
            })
            .flat();

        if (prevCheck === Checked.Black)
            ChessBoard.getInstance().setCheck(Colors.Black);
        if (prevCheck === Checked.White)
            ChessBoard.getInstance().setCheck(Colors.White);
        return moves.some(move => move.equals(this.coord));
    }

    // flag is used here for several reasons.
    // mostly it is used to avoid stack overflow
    public abstract getMoves(flag?: boolean): Coord[];

    public pinned(): [boolean, Coord[]] {
        let king = ChessBoard
            .getInstance()
            .getPieces()
            .find(piece =>
                piece.getType() === Pieces.King &&
                piece.getColor() === this.getColor()
            );
        if (king === undefined)
            throw Error("tf...");
        let kingCoord = king.getCoord();

        this.setCaptured();

        let enemyPieces = ChessBoard
            .getInstance()
            .getPieces()
            .filter(piece =>
                ChessBoard.getInstance().isPieceOnBoard(piece) &&
                piece.getType() !== Pieces.King &&
                piece.getColor() !== this.getColor()
            );

        let isPinned = enemyPieces.some(piece =>
            piece.getMoves(true).some(move => move.equals(kingCoord))
        );

        let moves: Coord[] = [];
        if (isPinned) {
            let attackCoords = enemyPieces
                .filter(piece =>
                    piece.getMoves(true).some(move => move.equals(kingCoord)))
                .map(piece => piece.coord)
                .flat();

            if (attackCoords === undefined || attackCoords[0] === undefined)
                return [false, []];

            if (attackCoords.length === 1) {
                let attack = attackCoords[0],
                    x = this.coord.getX(),
                    y = this.coord.getY();

                const d = (u: number): number => {
                    if (u === 0) return 0;
                    else if (u > 0) return -1;
                    return 1;
                }

                let dx = d(x - attack.getX()),
                    dy = d(y - attack.getY());
                if (this.type === Pieces.Bishop ||
                    this.type === Pieces.Queen ||
                    this.type === Pieces.Rook)
                    moves.push(...this.advancePiece(dx, dy));
                else if (this.type === Pieces.Pawn) {
                    let pawn = ChessBoard
                        .getInstance()
                        .getPieces()
                        .find(piece => piece.coord.equals(this.coord)) as Pawn;

                    if (pawn === undefined)
                        throw Error(`no pawn on ${this.printCoord(this.coord)}`);

                    if (attack.getX() === x)
                        moves.push(...pawn.getSteps());
                    else {
                        let pawnAttack = pawn.attack();
                        moves.push(...pawnAttack.filter(
                            a => a.equals(attack)
                        ));
                    }
                }
            }
        }

        this.unsetCaptured();

        return [isPinned, moves];
    }

    public makeMove(coord: Coord): void {
        let piece = ChessBoard.getInstance().getPiece(coord);
        if (piece !== undefined && piece.color !== this.color)
            piece.isCaptured = true;

        this.coord.setCoord(coord);

        ChessBoard.getInstance().incrementTotalMoves();
        this.moveOrder = ChessBoard.getInstance().getTotalMoves();
        ChessBoard.getInstance().clearAttacks();

        if (ChessBoard.getInstance().checkedBy(this.color).length !== 0)
            ChessBoard.getInstance().setCheck(this.color);
        else ChessBoard.getInstance().unsetCheck();
    }

    protected setMoveOrder(): void {
        this.moveOrder = ChessBoard.getInstance().getTotalMoves();
    }

    public setCaptured(): void {
        this.isCaptured = true;
    }

    public unsetCaptured(): void {
        this.isCaptured = false;
    }

    public getCoord(): Coord {
        return this.coord;
    }

    public getType(): Pieces {
        return this.type;
    }

    public getColor(): Colors {
        return this.color;
    }

    public getIsCaptured(): boolean {
        return this.isCaptured;
    }

    public getMoveOrder(): number {
        return this.moveOrder;
    }
}