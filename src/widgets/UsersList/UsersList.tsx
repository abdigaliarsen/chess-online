import { Follows, User } from "@prisma/client";
import { ProfileImage } from "../ProfileImage/ProfileImage";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faMessage, faUserPlus, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { UseMutateFunction } from "@tanstack/react-query";

interface UsersListProps {
  id: string,
  users: User[];
  type: "friends" | "recommendations";
  unfollow?: UseMutateFunction<Follows, unknown, any, unknown>;
  follow?: UseMutateFunction<Follows, unknown, any, unknown>;
  setActiveChatUser: React.Dispatch<React.SetStateAction<User | null>>;
  setHideChat?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UsersList({ id, users, type, unfollow, follow, setActiveChatUser, setHideChat }: UsersListProps) {
  return (
    <>
      <div className="flex flex-col">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ProfileImage
                    user={user}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
                    defaultImageClass="h-5 w-5"
                  />
                </div>
                <div>
                  <Link href={`/profile/${user.id}`}>
                    <h2 className="text-xl font-semibold text-white hover:text-black">{user.name}</h2>
                  </Link>
                  <p className="text-gray-500">Active 5m ago</p>
                </div>
              </div>
            </div>
            <ul className="flex">
              <li className="ml-4 hover:text-black">
                <Link
                  href={{
                    pathname: "play",
                    query: { oponent: user.id }
                  }}
                  title="Play">
                  <FontAwesomeIcon icon={faGamepad} />
                </Link>
              </li>
              <li className="ml-4 hover:text-black">
                <button
                  onClick={() => { setActiveChatUser((prev) => {
                    if (prev?.id === user.id) {
                      setHideChat?.(true);
                      return null;
                    }
                    setHideChat?.(false);
                    return user;
                  }); }}
                  title="Message">
                  <FontAwesomeIcon icon={faMessage} />
                </button>
              </li>
              {type === "friends" && unfollow && <li className="ml-4 hover:text-black">
                <button
                  title="Delete friend"
                  onClick={() => {
                    unfollow({
                      followerId: id, followingId: user.id
                    })
                  }}>
                  <FontAwesomeIcon icon={faUserXmark} />
                </button>
              </li>}
              {type === "recommendations" && follow && <li className="ml-4 hover:text-black">
                <button
                  onClick={() => {
                    follow({ followerId: id, followingId: user.id })
                  }}
                  title="Follow">
                  <FontAwesomeIcon icon={faUserPlus} />
                </button>
              </li>}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}