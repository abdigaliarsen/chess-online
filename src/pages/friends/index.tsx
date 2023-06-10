import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Messages, User } from "@prisma/client";
import { UsersList } from "~/widgets/UsersList/UsersList";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ChatBox } from "~/widgets/Chat/ChatBox";
import { createMessagesConnection } from "~/features/Messages/createConnection";

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

  // user id with whom we are chatting
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Messages[]>([]);

  const [usersMessages, setUsersMessages] = useState<{ [userId: string]: Messages[] } | null>(null);

  const [friends, setFriends] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [hideChat, setHideChat] = useState<boolean>(true);

  useEffect(() => {
    if (session.data) {
      return createMessagesConnection({
        senderId: session.data.user.id as string,
        setMessages: setActiveChatMessages,
      });
    }
  }, [session.data?.user.id]);

  useEffect(() => {
    if (activeChatUser && (!usersMessages || usersMessages[activeChatUser.id])) {
      setUsersMessages((prev) => {
        if (prev) {
          return {
            ...prev,
            [activeChatUser.id]: activeChatMessages
          }
        }
        return {
          [activeChatUser.id]: activeChatMessages
        }
      });
    }
  }, [activeChatUser, activeChatMessages]);

  api.user.getFriendsById.useQuery({ id: session.data.user.id }, {
    onError: (error) => {
      console.error(error)
    },
    onSuccess: (data) => {
      setFriends(data);
    }
  });

  api.message.getAllMessages.useQuery({ senderId: session.data.user.id }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setUsersMessages(data);
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
      {
        [
          { users: friends, title: "Friends" },
          { users: recommendations, title: "Recommendations" }
        ].map((item) =>
          <div>
            <div className="flex items-end">
              <h1 className="text-2xl font-bold mt-10 mr-4">{item.title}</h1>
              <span className="h-7 px-2 py-1 text-sm font-semibold bg-gray-500 text-white rounded-lg">
                {item.users?.length}
              </span>
            </div>
            <UsersList
              id={session.data.user.id}
              users={item.users}
              type={item.title.toLowerCase() as "friends" | "recommendations"}
              follow={follow}
              unfollow={unfollow}
              setActiveChatUser={setActiveChatUser}
              setHideChat={setHideChat}
            />
          </div>
        )
      }
      {activeChatUser !== null && usersMessages && <ChatBox
        hidden={hideChat || activeChatUser === null}
        setHide={setHideChat}
        sender={session.data.user as User}
        receiver={activeChatUser}
        messages={activeChatMessages}
        setMessages={setActiveChatMessages}
      />}
    </div>
  )
};

export default FriendsWrapper;