import { useRef } from "react";

import { Checked, Colors, Pieces } from "~/shared/ChessTypes";
import { Coord } from "~/shared/Coord";

import { MovePoint } from "./MovePoint";

import Rook from "./Pieces/Rook";
import Knight from "./Pieces/Knight";
import Bishop from "./Pieces/Bishop";
import Queen from "./Pieces/Queen";
import King from "./Pieces/King";
import Pawn from "./Pieces/Pawn";

import { Piece as PieceEntity } from "~/features/ChessBoard/Piece";

interface ChessPieceProps {
    magnifier: number;
    activePiece: Coord;
    checked: Checked;
    turn: React.MutableRefObject<boolean>;

    piece: PieceEntity;

    setMoves: React.Dispatch<React.SetStateAction<Array<JSX.Element>>>;
    setChecked: React.Dispatch<React.SetStateAction<Checked>>;
    setTotalMoves: React.Dispatch<React.SetStateAction<number>>;
}

export function Piece(props: ChessPieceProps) {
    const pieceEntity = useRef<PieceEntity>(props.piece);

    const piece = (): JSX.Element => {
        var pieceProps = {
            magnifier: props.magnifier,
            coord: pieceEntity.current.getCoord(),
            color: pieceEntity.current.getColor(),
        };

        switch (pieceEntity.current.getType()) {
            case Pieces.Rook: return <Rook {...pieceProps} />
            case Pieces.Knight: return <Knight {...pieceProps} />
            case Pieces.Bishop: return <Bishop {...pieceProps} />
            case Pieces.Queen: return <Queen {...pieceProps} />
            case Pieces.King: return <King {...pieceProps} checked={props.checked} />
            case Pieces.Pawn: return <Pawn {...pieceProps} />
        }
    }

    const showMoves = (e: React.MouseEvent) => {
        e.preventDefault();

        if ((props.turn.current === true && pieceEntity.current.getColor() === Colors.Black) ||
            (props.turn.current === false && pieceEntity.current.getColor() === Colors.White))
            return;

        if (props.activePiece.equals(pieceEntity.current.getCoord())) {
            props.setMoves([]);
            props.activePiece.setCoord(new Coord());
            return;
        }

        const moveProps = {
            magnifier: props.magnifier,
            turn: props.turn,
            piece: pieceEntity.current,
            setMoves: props.setMoves,
            setChecked: props.setChecked,
            setTotalMoves: props.setTotalMoves
        }

        props.setMoves(pieceEntity.current.getMoves().map(coord => <MovePoint coord={coord} {...moveProps} />));
        props.activePiece.setCoord(pieceEntity.current.getCoord());
    }

    if (pieceEntity.current.getIsCaptured())
        return <></>

    const pieceStyle: React.CSSProperties = {
        transitionTimingFunction: "linear",
        transitionDuration: "0.25s",
        padding: "5px",
        position: "absolute",
        top: pieceEntity.current.getCoord().getY() * props.magnifier * 32 + "px",
        left: pieceEntity.current.getCoord().getX() * props.magnifier * 32 + "px",
        width: 32 * props.magnifier,
        height: 32 * props.magnifier
    };

    return (
        <>
            <svg
                onClick={showMoves}
                style={pieceStyle}>
                {piece()}
            </svg >
        </>
    );
}

export default Piece;