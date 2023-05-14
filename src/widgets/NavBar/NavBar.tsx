import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavBar() {
  const session = useSession();

  let navigations: Array<[string, string]> = [];
  let authBtn: JSX.Element;

  if (session.status === "authenticated") {
    navigations = [
      ['Home', '/'],
      ['FAQ', '/faq'],
      ['Profile', '/profile'],
      ['Friends', '/friends'],
    ];
    authBtn = <button
      onClick={() => signOut()}
      className="px-3 py-2 text-white font-extrabold font-mono hover:text-slate-900">
        Logout
      </button>
  }
  else {
    navigations = [
      ['Home', '/'],
      ['FAQ', '/faq'],
    ];
    authBtn = <button
      onClick={() => signIn()}
      className="px-3 py-2 text-white font-extrabold font-mono hover:text-slate-900">
        Log in
      </button>
  }

  return (
    <nav className="flex sm:justify-center space-x-4">
      {navigations.map(([title, url]) => {
        if (!url) return <></>
        return <Link
          href={url}
          className="px-3 py-2 text-white font-extrabold font-mono hover:text-slate-900">
          {title}
        </Link>
      })}
      {authBtn}
    </nav>
  )
}