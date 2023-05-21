import { User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { ProfileImage } from "~/widgets/ProfileImage/ProfileImage";

const Messenger: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const session = useSession();

  const [user, setUser] = useState<User | null>(null);

  api.user.getById.useQuery({ id: id as string }, {
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      setUser(data);
    }
  });

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded shadow-md mb-8">
          <div className="flex items-center border-b border-gray-200 px-6 py-4">
            <ProfileImage
              user={user}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full mr-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
              defaultImageClass="h-5 w-5"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">Active 5m ago</p>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-start mb-4">
              <ProfileImage
                user={user}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
                defaultImageClass="h-5 w-5"
              />
              <div className="bg-gray-200 rounded-lg py-2 px-4">
                <p className="text-sm text-gray-800">Hello, how can I help you?</p>
              </div>
            </div>

            <div className="flex items-end justify-end mb-4">
              <div className="bg-blue-500 rounded-lg py-2 px-4">
                <p className="text-sm text-white">Sure, I can assist you with that.</p>
              </div>
              <ProfileImage
                user={{
                  image: session.data?.user.image as string
                } as User}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full ml-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
                defaultImageClass="h-5 w-5"
              />
            </div>

            <div className="flex items-start mb-4">
              <ProfileImage
                user={user}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
                defaultImageClass="h-5 w-5"
              />
              <div className="bg-gray-200 rounded-lg py-2 px-4">
                <p className="text-sm text-gray-800">Here's the information you requested:</p>
                <p className="text-sm text-gray-800">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>

          </div>

          <div className="bg-gray-200 px-6 py-4 flex items-center">
            <input type="text" placeholder="Type your message..."
              className="rounded-full bg-white border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-blue-500" />
            <button className="bg-blue-500 text-white rounded-full px-4 py-2 ml-4">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;