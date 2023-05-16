import { User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const ProfileWrapper: NextPage = () => {
  const session = useSession();

  if (session.status !== "authenticated")
    return <></>;

  return <Profile />;
}

const Profile: NextPage = () => {
  const session = useSession();

  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User>();
  const [isThisUser, setIsThisUser] = useState<boolean>(false);

  const [country, setCountry] = useState<string | null>();
  const [city, setCity] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();

  api.user.getById.useQuery({ id: id as string }, {
    onError: (error) => {
    },
    onSuccess: (data: User) => {
      setUser(data);
      setCountry(data.country);
      setCity(data.city);
      setDescription(data.description);
      setIsThisUser(session.data !== null && session.data.user.id === data.id)
    }
  });

  const { mutate: updateCountry } = api.user.updateCountry.useMutation({
    onMutate: (data) => {
      setUser(prev => {
        if (prev)
          return { ...prev, ...data };
        return prev;
      });
    }
  });

  const { mutate: updateCity } = api.user.updateCity.useMutation({
    onMutate: (data) => {
      setUser(prev => {
        if (prev)
          return { ...prev, ...data };
        return prev;
      });
    }
  });

  const { mutate: updateDescription } = api.user.updateDescription.useMutation({
    onMutate: (data) => {
      setUser(prev => {
        if (prev)
          return { ...prev, ...data };
        return prev;
      });
    }});

  const saveCityOrCountry = () => {
    if (city !== user?.city) {
      updateCity({ id: user?.id as string, city: city as string });
    }

    if (country !== user?.country) {
      updateCountry({ id: user?.id as string, country: country as string });
    }
  }

  let saveCityOrCountryBtn = <></>;
  if (country !== user?.country || city !== user?.city)
    saveCityOrCountryBtn = <button
      onClick={saveCityOrCountry}
      className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mt-8"
    >Save changes
    </button>;
  
  let saveDescriptionBtn = <></>;
  if (description !== user?.description)
    saveDescriptionBtn = <button
      onClick={() => updateDescription({ id: user?.id as string, description: description as string })}
      className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mt-8"
    >Save changes
    </button>;

  return (
    <div className="p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-2 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">10</p>
              <p className="text-gray-400">Games</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400">Friends</p>
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

          {<div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button
              className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Connect
            </button>
            <button
              className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Message
            </button>
          </div> /*&& isThisUser*/}
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

export default ProfileWrapper;