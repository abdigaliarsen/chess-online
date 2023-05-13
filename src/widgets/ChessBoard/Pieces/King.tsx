import { Colors, Checked } from "~/shared/ChessTypes";

export interface PieceData {
    color: Colors;
    magnifier: number | undefined;
}

interface KingProps extends PieceData {
    checked: Checked
}

export default function King(props: KingProps) {
    let checked =
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="gradient">
                    <stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
                    <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#gradient)" />
        </svg>;

    switch (props.color) {
        case Colors.Black:
            return (
                <>
                    {props.checked === Checked.White && checked}
                    <g fill="none" fillRule="evenodd" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M 22.5,11.63 L 22.5,6" style={{ fill: "none", stroke: "#000000", strokeLinejoin: "miter" }} id="path6570" />
                        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style={{ fill: "#000000", fillOpacity: 1, strokeLinecap: "butt", strokeLinejoin: "miter" }} />
                        <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style={{ fill: "#000000", stroke: "#000000" }} />
                        <path d="M 20,8 L 25,8" style={{ fill: "none", stroke: "#000000", strokeLinejoin: "miter" }} />
                        <path d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5" style={{ fill: "none", stroke: "#ffffff" }} />
                        <path d="M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37" style={{ fill: "none", stroke: "#ffffff" }} />
                    </g>
                </>
            );
        case Colors.White:
            return (
                <>
                    {props.checked === Checked.Black && checked}
                    <g fill="none" fillRule="evenodd" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path strokeLinejoin="miter" d="M22.5 11.63V6M20 8h5" />
                        <path fill="#fff" style={{ strokeLinecap: "butt", strokeLinejoin: "miter" }} d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
                        <path fill="#fff" d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" />
                        <path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0" />
                    </g>
                </>
            );
    }
}