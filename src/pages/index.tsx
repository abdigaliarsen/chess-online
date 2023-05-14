import { type NextPage } from "next";
import { ChessBoard } from "~/widgets/ChessBoard/ChessBoard";

const Home: NextPage = () => {
	return (
		<>
			<main>
				<ChessBoard magnifier={1.8} x={0} y={0} setWon={() => { }} />
			</main>
		</>
	);
};

export default Home;
