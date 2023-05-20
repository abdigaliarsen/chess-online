import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { NavBar } from "~/widgets/NavBar/NavBar";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import image from "~/assets/chess-background.jpg";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session} >
      <title>Chess Online</title>
      <meta name="description" content="Chess Online by abdigaliarsen" />
      <link rel="icon" href="/favicon.ico" />
      <div className="overflow-hidden" style={{ backgroundImage: `url(${image.src})` }}>
        <div className="min-h-screen bg-cover bg-center bg-repeat" >
          <div className="container mx-auto">
            <NavBar />
            <div className="mt-10" >
              <Component {...pageProps} />
            </div>
          </div>
        </div>
        <footer className="md:flex md:items-center md:justify-between md:p-6">
          <ul className="flex flex-wrap items-center mt-3 sm:mt-0">
            <li>
              <a
                href="https://github.com/abdigaliarsen"
                className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400">
                Created by Arsen Abdigali
              </a>
            </li>
            <li>
              <a
                href="https://github.com/abdigaliarsen/chess-online"
                className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400">
                GitHub
              </a>
            </li>
          </ul>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
