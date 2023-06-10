import { Follows, Messages, User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createMessagesConnection } from "~/features/Messages/createConnection";
import { pusherClient } from "~/features/pusher";
import { api } from "~/utils/api";
import { ChatBox } from "~/widgets/Chat/ChatBox";
import { ProfileImage } from "~/widgets/ProfileImage/ProfileImage";

interface ProfileProps {
  profileId: string;
}

const ProfileWrapper = () => {
  const router = useRouter();
  const { id } = router.query;

  if (id === undefined)
    return <></>;

  return <Profile profileId={id as string} />;
}

const Profile: NextPage<ProfileProps> = ({ profileId }: ProfileProps) => {
  const session = useSession();

  const [user, setUser] = useState<User & {
    followedBy: Follows[];
    following: Follows[];
  } | null>();

  const [messages, setMessages] = useState<Messages[]>([]);

  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const [country, setCountry] = useState<string | null>();
  const [city, setCity] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();

  const [hideChat, setHideChat] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setCountry(user.country);
      setCity(user.city);
      setDescription(user.description);
    }
  }, [user]);

  useEffect(() => {
    if (session.data) {
      return createMessagesConnection({
        senderId: session.data.user.id as string,
        setMessages: setMessages,
      })
    }
  }, [session.data?.user.id]);

  api.message.getMessages.useQuery({ senderId: session.data?.user.id as string, receiverId: user?.id as string }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setMessages(data);
    }
  });

  api.follow.doesFollow.useQuery({ followingId: profileId, followerId: session.data?.user.id as string }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setIsFollowed(data);
    }
  });

  api.user.getById.useQuery({ id: profileId }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setUser(data);
    }
  });

  const { mutate: updateUser } = api.user.updateUserProfile.useMutation({
    onMutate: (data) => {
      setUser((prev) => {
        if (prev) {
          return { ...prev, ...data };
        }
        return prev;
      })
    }
  });

  const { mutate: follow } = api.follow.setFollow.useMutation({
    onMutate: (data) => {
      setUser((prev) => {
        if (prev) {
          return {
            ...prev,
            followedBy: [...prev.followedBy, data]
          };
        }
        return prev;
      });
      setIsFollowed(true);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const { mutate: unfollow } = api.follow.setUnfollow.useMutation({
    onMutate: (data) => {
      setUser((prev) => {
        if (prev) {
          return {
            ...prev,
            followedBy: prev.followedBy.filter((follow) => follow.followerId !== data.followerId)
          };
        }
        return prev;
      });
      setIsFollowed(false);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const saveUpdates = () => {
    updateUser({
      id: profileId,
      city: city ? city : "",
      country: country ? country : "",
      description: description ? description : ""
    });
  }

  let saveCityOrCountryBtn = <></>;
  if (country && country !== user?.country || city && city !== user?.city)
    saveCityOrCountryBtn = <button
      onClick={saveUpdates}
      className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mt-8"
    >Save changes
    </button>;

  let saveDescriptionBtn = <></>;
  if (description && description !== user?.description)
    saveDescriptionBtn = <button
      onClick={saveUpdates}
      className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mt-8"
    >Save changes
    </button>;

  return (
    <div
      className="p-16"
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Esc") {
          setHideChat(true);
        }
      }}
    >
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">10</p>
              <p className="text-gray-400">Games</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{user?.followedBy.length}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{user?.following.length}</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>

          <div className="relative">
            <ProfileImage
              user={user as User}
              width={192}
              height={192}
              className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
              defaultImageClass="h-24 w-24"
            />
          </div>

          {session.status === "authenticated" && user && session.data.user.id !== profileId &&
            <div className="space-x-8 flex items-center justify-between mt-32 md:mt-0 md:justify-center">
              {isFollowed ?
                <button
                  onClick={() => unfollow({ followingId: profileId as string, followerId: session.data.user.id })}
                  className="text-white py-2 px-4 uppercase rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                >
                  Unfollow
                </button> :
                <button
                  onClick={() => follow({ followingId: profileId as string, followerId: session.data.user.id })}
                  className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                >
                  Follow
                </button>}
              <button
                onClick={() => { setHideChat(!hideChat); }}
                className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Message
              </button>
            </div>}
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">{user?.name}</h1>
          <p className="font-light text-gray-600 mt-3">
            <input
              className="text-gray-600 font-light italic text-right outline-none"
              type="text"
              placeholder={session.data?.user.id === profileId ? "your city" : ""}
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)}
              disabled={user?.id !== session.data?.user.id}
            />
            , <input
              className="text-gray-600 font-light italic outline-none"
              type="text"
              placeholder={session.data?.user.id === profileId ? "your country" : ""}
              value={country ? country : ""}
              onChange={(e) => setCountry(e.target.value)}
              disabled={user?.id !== session.data?.user.id}
            />
          </p>

          {saveCityOrCountryBtn}

          {!(session.data?.user.id !== profileId && description === null) && <p className="mt-8 text-gray-500">
            <input className="text-gray-600 disabled:bg-transparent font-light italic text-center outline-none"
              type="text"
              placeholder="your description"
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
              disabled={user?.id !== session.data?.user.id}
            />
          </p>}
          {saveDescriptionBtn}
        </div>

        <div className="mt-12 flex flex-col justify-center">
        </div>
        {session.data?.user !== undefined && user !== undefined &&
          <ChatBox
            hidden={hideChat}
            setHide={setHideChat}
            sender={session.data.user as User}
            receiver={user as User}
            messages={messages}
            setMessages={setMessages}
          />}
      </div>
    </div>
  )
}

export default ProfileWrapper;