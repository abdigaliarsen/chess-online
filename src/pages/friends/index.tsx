import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { faGamepad, faMessage, faUserXmark, faUserPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { User } from "@prisma/client";

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

  const [friends, setFriends] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);

  api.user.getFriendsById.useQuery({ id: session.data.user.id }, {
    onError: (error) => {
      console.error(error)
    },
    onSuccess: (data) => {
      setFriends(data);
    }
  });

  api.user.getUnfollowedUsers.useQuery({ id: session.data.user.id, count: 10 }, {
    onError: (error) => {
      console.error(error)
    },
    onSuccess: (data) => {
      console.log(data);
      setRecommendations(data);
    }
  });

  const { mutate: follow } = api.follow.setFollow.useMutation({
    onMutate: (data) => {
      setRecommendations((prev) => {
        if (prev) {
          return prev.filter((user) => user.id !== data.followingId);
        }
        return prev;
      });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const { mutate: unfollow } = api.follow.setUnfollow.useMutation({
    onMutate: (data) => {
      setFriends((prev) => {
        if (prev) {
          return prev.filter((user) => user.id !== data.followingId);
        }
        return prev;
      });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return (
    <div className="text-white container mx-auto px-96">
      <div className="flex justify-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="pl-2 italic border border-gray-300 w-full bg-transparent rounded" />
        <FontAwesomeIcon
          tabIndex={-1}
          onClick={() => { }}
          onKeyDown={(e) => { console.log(e) }}
          onChange={() => { }}
          className="cursor-pointer absolute right-2 top-1"
          icon={faMagnifyingGlass} />
      </div>
      <div>
        <div className="flex items-end">
          <h1 className="text-2xl font-bold mt-10 mr-4">Friends</h1>
          <span className="h-7 px-2 py-1 text-sm font-semibold bg-gray-500 text-white rounded-lg">
            {friends?.length}
          </span>
        </div>
        {friends?.map((friend, index) =>
          <div key={index} className="flex mt-10 justify-between">
            <div className="flex">
              <div className="">
                <Image
                  src={friend.image ? friend.image : "/default-profile.png"}
                  width={50}
                  height={50}
                  alt="profile picture"
                  priority={true}
                />
              </div>
              <div className="flex-col items-center ml-6">
                <Link href={`/profile/${friend.id}`} className="hover:text-black font-bold">
                  {friend.name}
                </Link>
                <p className="text-gray-500">{ }</p>
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
                <button
                  title="Delete friend"
                  onClick={() => {
                    unfollow({
                      followerId: session.data.user.id, followingId: friend.id
                    })
                  }}>
                  <FontAwesomeIcon icon={faUserXmark} />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-end">
          <h1 className="text-2xl font-bold mt-10 mr-4">Recommendations</h1>
          <span className="h-7 px-2 py-1 text-sm font-semibold bg-gray-500 text-white rounded-lg">
            {recommendations?.length}
          </span>
        </div>
        {recommendations?.map((recommendation, index) =>
          <div key={index} className="flex mt-10 justify-between">
            <div className="flex">
              <div className="">
                <Image
                  src={recommendation.image ? recommendation.image : "/default-profile.png"}
                  width={50}
                  height={50}
                  alt="profile picture"
                  priority={true}
                />
              </div>
              <div className="flex-col items-center ml-6">
                <Link href={`/profile/${recommendation.id}`} className="hover:text-black font-bold">
                  {recommendation.name}
                </Link>
                <p className="text-gray-500">{ }</p>
              </div>
            </div>
            <ul className="flex">
              <li className="ml-4 hover:text-black">
                <Link
                  href={{
                    pathname: "play",
                    query: { oponent: recommendation.id }
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
                <button
                  onClick={() => {
                    follow({ followerId: session.data.user.id, followingId: recommendation.id })
                  }}
                  title="Follow">
                  <FontAwesomeIcon icon={faUserPlus} />
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