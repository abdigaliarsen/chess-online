import { Piece } from "~/features/ChessBoard/Piece";
import { ChessBoard } from "~/features/ChessBoard/ChessBoard";

import { Coord } from "~/shared/Coord";
import { Checked } from "~/shared/ChessTypes";

interface MovePointData {
    magnifier: number;
    coord: Coord;
    turn: React.MutableRefObject<boolean>;
    piece: Piece;

    setMoves: React.Dispatch<React.SetStateAction<Array<JSX.Element>>>;
    setChecked: React.Dispatch<React.SetStateAction<Checked>>;
    setTotalMoves: React.Dispatch<React.SetStateAction<number>>;
}

export function MovePoint(props: MovePointData) {
    const makeMove = () => {
        props.piece.makeMove(props.coord);
        props.setChecked(ChessBoard.getInstance().getIsCheck());

        props.setMoves([]);
        props.turn.current = !props.turn.current;
        props.setTotalMoves(moves => moves + 1);
    }

    return (
        <>
            <div onClick={makeMove}
                style={{
                    backgroundColor: "transparent",
                    top: props.coord.getY() * props.magnifier * 32 + "px",
                    left: props.coord.getX() * props.magnifier * 32 + "px",
                    position: "absolute",
                    cursor: "pointer",
                    margin: "5px",
                    zIndex: 100
                }}>

                <div
                    style={{
                        height: 12 * props.magnifier + "px",
                        width: 12 * props.magnifier + "px",
                        backgroundColor: "#bbb",
                        borderRadius: "50%",
                        margin: "13px",
                        opacity: 0.8
                    }}>
                </div>
            </div>
        </>
    )
}