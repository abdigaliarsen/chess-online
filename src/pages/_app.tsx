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
      <div className="overflow-hidden">
        <div className="min-h-screen bg-cover bg-center bg-repeat" style={{ backgroundImage: `url(${image.src})` }}>
          <div className="container mx-auto">
            <NavBar />
            <div className="mt-10" >
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
