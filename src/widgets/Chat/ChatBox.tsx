import { Messages, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { ProfileImage } from "../ProfileImage/ProfileImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

interface ChatBoxProps {
	sender: User,
	receiver: User,
	hidden: boolean;
	setHide: React.Dispatch<React.SetStateAction<boolean>>;
	messages: Messages[];
	setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
}

export function ChatBox({ hidden, sender, receiver, setHide, messages, setMessages }: ChatBoxProps) {
	let users: any = {};
	users[sender.id] = sender;
	users[receiver.id] = receiver;

	const [message, setMessage] = useState<string>("");
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesContainerRef.current)
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
	});

	const { mutate: sendMessage } = api.message.sendMessage.useMutation({
		onMutate: (data) => {
			setMessages(prev => [...prev, { ...data, createdAt: new Date() }]);
			setMessage("");
		},
		onError: (error) => {
			console.error(error);
		}
	});

	let messagesList = messages.length > 0 ? messages.map((message, index) =>
		<div key={index} className="mb-4">
			<div className="flex items-start">
				<ProfileImage
					user={users[message.senderId]}
					height={32}
					width={32}
					className="w-8 h-8 rounded-full mr-4 bg-indigo-100 text-indigo-500 flex items-center justify-center"
					defaultImageClass="h-5 w-5"
				/>
				<div className="ml-2">
					<p className="font-semibold">
						{users[message.senderId].name === sender.name ? "You" : users[message.senderId].name}
						<span className="text-gray-400 text-xs ml-2">
							{format(message.createdAt, "HH:mm")}
						</span>
					</p>
					<p>{message.content}</p>
				</div>
			</div>
		</div>
	) :
		<div className="flex justify-center mb-4">
			<p className="text-gray-400">No messages yet</p>
		</div>;

	return (
		<div
			id="chatBox"
			className={`flex flex-col fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-4 w-64 h-72 text-black ${hidden ? "hidden" : ""}`}
		>
			<button onClick={() => { setHide(true); }} className="absolute top-2 right-2">
				<span className="text-gray-600 text-sm">
					<FontAwesomeIcon icon={faXmark} />
				</span>
			</button>
			<div ref={messagesContainerRef} className="flex-grow overflow-y-auto mt-7">
				{messagesList}
			</div>
			<div className="mt-4">
				<div className="flex-grow">
					<input
						id="chatInput"
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && message !== "") {
								sendMessage({ content: message, senderId: sender.id, receiverId: receiver.id });
							}
						}}
						className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none" />
				</div>
			</div>
		</div>

	)
}