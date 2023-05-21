import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { User } from "@prisma/client";
import { UsersList } from "~/widgets/UsersList/UsersList";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
          className="pl-2 pr-10 py-2 border border-gray-500 w-full bg-transparent rounded-md focus:outline-none"
          aria-label="Search"
        />
        <FontAwesomeIcon
          tabIndex={-1}
          onClick={() => { }}
          onKeyDown={(e) => { console.log(e) }}
          onChange={() => { }}
          className="cursor-pointer absolute right-2 top-3"
          icon={faMagnifyingGlass} />
      </div>
      <div>
        <div className="flex items-end">
          <h1 className="text-2xl font-bold mt-10 mr-4">Friends</h1>
          <span className="h-7 px-2 py-1 text-sm font-semibold bg-gray-500 text-white rounded-lg">
            {friends?.length}
          </span>
        </div>
        <UsersList id={session.data.user.id} users={friends} unfollow={unfollow} />
      </div>
      <div>
        <div className="flex items-end">
          <h1 className="text-2xl font-bold mt-10 mr-4">Recommendations</h1>
          <span className="h-7 px-2 py-1 text-sm font-semibold bg-gray-500 text-white rounded-lg">
            {recommendations?.length}
          </span>
        </div>
        <UsersList id={session.data.user.id} users={recommendations} follow={follow} />
      </div>
    </div>
  )
};

export default FriendsWrapper;