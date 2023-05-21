import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavBar() {
  const session = useSession();

  let navigations: Array<[string, string]> = [];
  let authElement: JSX.Element;

  if (session.status === "authenticated") {
    navigations = [
      ['Home', '/'],
      ['Profile', `/profile/${session.data.user.id}`],
      ['Play', '/play'],
      ['Friends', '/friends'],
      ['FAQ', '/faq'],
    ];
    authElement = <button
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
    authElement = <Link
      href="/auth/signin"
      className="px-3 py-2 text-white font-extrabold font-mono hover:text-slate-900">
        Log in
      </Link>
  }

  return (
    <nav className="flex sm:justify-center space-x-4">
      {navigations.map(([title, url], index) => {
        if (!url) return <></>
        return <Link
          key={index}
          href={url}
          className="px-3 py-2 text-white font-extrabold font-mono hover:text-slate-900">
          {title}
        </Link>
      })}
      {authElement}
    </nav>
  )
}