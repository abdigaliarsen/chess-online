import { Follows, User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const session = useSession();

  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User & {
    followedBy: Follows[];
    following: Follows[];
  } | null>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const [country, setCountry] = useState<string | null>();
  const [city, setCity] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();

  useEffect(() => {
    if (user) {
      setCountry(user.country);
      setCity(user.city);
      setDescription(user.description);
    }
  }, [user]);

  api.follow.doesFollow.useQuery({ followingId: id as string, followerId: session.data?.user.id as string }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setIsFollowed(data);
    }
  });

  api.user.getById.useQuery({ id: id as string }, {
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
      id: user?.id as string,
      city: city as string,
      country: country as string,
      description: description as string
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
    <div className="p-16">
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
            {user ? <Image
              className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
              src={`${user.image}`}
              alt='profile image'
              width={192}
              height={192} /> :
              <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>}
          </div>

          {session.status === "authenticated" && session.data?.user.id !== user?.id && <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            {isFollowed ?
              <button
              onClick={() => unfollow({ followingId: user?.id as string, followerId: session.data.user.id })}
              className="text-white py-2 px-4 uppercase rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Unfollow
            </button> :
              <button
                onClick={() => follow({ followingId: user?.id as string, followerId: session.data.user.id })}
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Follow
              </button>}
            <button
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
              placeholder="your city"
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)} />
            , <input
              className="text-gray-600 font-light italic outline-none"
              type="text"
              placeholder="your country"
              value={country ? country : ""}
              onChange={(e) => setCountry(e.target.value)} />
          </p>

          {saveCityOrCountryBtn}

          <p className="mt-8 text-gray-500">
            <input className="text-gray-600 font-light italic text-center outline-none"
              type="text"
              placeholder="your description"
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)} />
          </p>
          {saveDescriptionBtn}
        </div>

        <div className="mt-12 flex flex-col justify-center">
        </div>

      </div>
    </div>
  )
}

export default Profile;