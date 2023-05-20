import { type NextPage } from "next";

import Image from "next/image";

import image1 from "~/assets/epic-chess-bg-1.jpg";
import image2 from "~/assets/epic-chess-bg-2.jpeg";
import image3 from "~/assets/epic-chess-bg-3.jpg";

const FAQ: NextPage = () => {
  return (
    <div className="px-6 mx-auto">
      <section className="text-gray-800">
        <div className="mx-auto xl:px-32 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="mb-12 lg:mb-0">
              <div
                className="block rounded-lg shadow-lg px-6 py-12 lg:py-6 xl:py-12 md:px-12 lg:-mr-14"
                style={{ background: "hsla(0, 0%, 100%, 0.55)", backdropFilter: "blur(30px)" }}
              >
                <h3 className="text-2xl font-bold mb-3">General Questions</h3>
                <h5 className="text-lg text-blue-600 font-bold mb-12 lg:mb-10 xl:mb-12">Let us answer your questions</h5>

                <p className="font-bold mb-4">What is the objective of chess?</p>
                <p className="text-gra-500 mb-6">
                  The objective of chess is to checkmate your opponent's king, which means placing it under an attack in such a way that it has no legal move to escape capture.
                </p>

                <p className="font-bold mb-4">How do I play chess online?</p>
                <p className="text-gra-500 mb-6">
                  To play chess online, you need to sign up for an online chess platform and create an account. Then, you can join games or create your own game, choose your opponent, and start playing.
                </p>

                <p className="font-bold mb-4">
                  What is a time control in chess?
                </p>
                <p className="text-gra-500 mb-6">
                  A time control is a way of limiting the total time each player has to make their moves. There are different types of time controls, such as blitz, rapid, and classical, each with different time limits.
                </p>

                <h3 className="text-2xl font-bold mb-3">Playing Chess Online</h3>

                <p className="font-bold mb-4">
                  How do I make a move in an online chess game?
                </p>
                <p className="text-gra-500 mb-3">
                  To make a move in an online chess game, click on the piece you want to move and then click on the square you want to move it to. Make sure the move is legal before you make it, as illegal moves can result in penalties or loss of the game.
                </p>

                <p className="font-bold mb-4">
                  How do I make a move in an online chess game?
                </p>
                <p className="text-gra-500 mb-3">
                  To make a move in an online chess game, click on the piece you want to move and then click on the square you want to move it to.
                </p>

                <p className="font-bold mb-4">
                  What happens if my internet connection is lost during a game?
                </p>
                <p className="text-gra-500 mb-3">
                  If your internet connection is lost during a game, the platform will try to reconnect you automatically. If the connection is not restored within a certain time limit, you may lose the game by forfeit.
                </p>

                <p className="font-bold mb-4">
                  Can I play against the computer in an online chess game?
                </p>
                <p className="text-gra-500 mb-3">
                  Yes, most online chess platforms allow you to play against the computer at different difficulty levels.
                </p>

                <p className="font-bold mb-4">
                  Can I chat with my opponent during a game?
                </p>
                <p className="text-gra-500 mb-3">
                  Yes, most online chess platforms allow you to chat with your opponent during a game. However, make sure to keep the conversation respectful and focused on the game.
                </p>
              </div>
            </div>

            <div>
              <Image
                src={image1}
                className="w-full rounded-lg shadow-lg"
                alt="epic chess background"
                width={image1.width}
                height={image1.height}
              />
              <Image
                src={image2}
                className="w-full rounded-lg shadow-lg mt-40 mb-40"
                alt="epic chess background"
                width={image2.width}
                height={image2.height}
              />
              <Image
                src={image3}
                className="w-full rounded-lg shadow-lg"
                alt="epic chess background"
                width={image3.width}
                height={image3.height}
              />
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default FAQ;
