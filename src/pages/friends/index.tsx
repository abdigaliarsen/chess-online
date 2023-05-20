import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { faGamepad, faMessage, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FriendsWrapper = () => {
  const session = useSession();
  if (session.status !== "authenticated")
    return <></>;
  return <Friends />;
}

const Friends = () => {
  const session = useSession();

  if (session.status !== "authenticated")
    return <></>;

  // const { data: friends } = api.user.getFriendsById.useQuery({ id: session.data.user.id }, {
  //   onError: (error) => {
  //     console.error(error)
  //   }
  // });

  const friend = {
    id: "clhqk1fbs0000squ0wnvy115y",
    name: "Arsen",
    src: "https://cdn.discordapp.com/avatars/519563633542561802/14afc6fa2c1f0f7d9597102363ae7a90.png",
    online: "Online"
  };

  const friends = [friend, friend, friend, friend, friend, friend, friend, friend];

  return (
    <div className="text-white container mx-auto px-96">
      <div >
        <input className="border-solid bg-transparent outline-gray-600 border-gray-600 rounded-m" />
      </div>
      <div>
        {friends?.map((friend) =>
          <div key={friend.name} className="flex mt-10 justify-between">
            <div className="flex">
              <div className="">
                <Image
                  src={friend.src}
                  width={50}
                  height={50}
                  alt="profile picture"
                />
              </div>
              <div className="flex-col items-center ml-6">
                <Link href={`/profile/${friend.id}`} className="hover:text-black font-bold">
                  {friend.name}
                </Link>
                <p className="text-gray-500">{friend.online}</p>
              </div>
            </div>
            <ul className="flex">
              <li className="ml-4 hover:text-black">
                <Link
                  href={{
                    pathname: "play",
                    query: { oponent: friend.id }
                  }}
                  title="Play">
                  <FontAwesomeIcon icon={faGamepad} />
                </Link>
              </li>
              <li className="ml-4 hover:text-black">
                <button title="Message">
                  <FontAwesomeIcon icon={faMessage} />
                </button>
              </li>
              <li className="ml-4 hover:text-black">
                <button title="Delete friend">
                  <FontAwesomeIcon icon={faUserXmark} />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
};

export default FriendsWrapper;