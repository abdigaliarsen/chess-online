import { useState, useEffect, useRef } from "react";
import { Piece } from "./Piece";
import { Coord } from "~/shared/Coord";
import { Checked, Colors } from "~/shared/ChessTypes";
import { ChessBoard as ChessBoardEntity } from "~/features/ChessBoard/ChessBoard";

interface ChessBoardProps {
    magnifier: number;
    x: number;
    y: number;
    setWon: React.Dispatch<React.SetStateAction<"BLACK" | "WHITE" | "DRAW" | undefined>>;
}

export function ChessBoard(props: ChessBoardProps) {
    const [board, setBoard] = useState<Array<JSX.Element>>([]);
    const [moves, setMoves] = useState<Array<JSX.Element>>([]);
    const [pieces, setPieces] = useState<Array<JSX.Element>>([]);
    const [checked, setChecked] = useState<Checked>(Checked.Neutral);
    const [totalMoves, setTotalMoves] = useState<number>(0);

    const turn = useRef<boolean>(true);
    const activePiece = useRef<Coord>(new Coord());

    useEffect(() => {
        const square = (color: string, x: number, y: number) => {
            let side = 32 * props.magnifier;
            return <div
                style={{
                    position: "absolute",
                    backgroundColor: color,
                    top: y * side + "px",
                    left: x * side + "px",
                    height: side + "px",
                    width: side + "px",
                    pointerEvents: "none"
                }}></div>;
        }

        const piecesProps = {
            activePiece: activePiece.current,
            magnifier: props.magnifier,
            turn: turn,
            setMoves: setMoves,
            checked: checked,
            setChecked: setChecked,
            setTotalMoves: setTotalMoves
        };

        let board: Array<JSX.Element> = [];
        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 8; ++j)
                board.push(square(i % 2 !== j % 2 ? "brown" : "wheat", i, j));

        setBoard(board);

        setPieces(ChessBoardEntity.getInstance().getPieces().map((piece, index) =>
            <Piece key={index} piece={piece} {...piecesProps} />
        ));

    }, [props.magnifier, activePiece, turn, checked, setMoves, setPieces, setBoard]);

    useEffect(() => {
        const piecesProps = {
            activePiece: activePiece.current,
            magnifier: props.magnifier,
            turn: turn,
            setMoves: setMoves,
            checked: checked,
            setChecked: setChecked,
            setTotalMoves: setTotalMoves
        };
        setPieces(ChessBoardEntity.getInstance().getPieces().map((piece, index) =>
            <Piece key={index} piece={piece} {...piecesProps} />
        ));

        let isMate = ChessBoardEntity.getInstance().isMateFor(turn.current ? Colors.White : Colors.Black);
        if (isMate)
            props.setWon(turn.current ? "BLACK" : "WHITE");
    }, [props, checked, totalMoves]);

    return (
        <>
            <div style={{ width: "461px", position: "sticky" }} >
                {board.map((square, index) =>
                    <div key={index}>{square}</div>
                )}
                {moves.map((dot, index) =>
                    <div key={index}>{dot}</div>
                )}
                {pieces.map((piece, index) =>
                    <div key={index}>{piece}</div>
                )}
            </div>
        </>
    )
}