import { Messages } from "@prisma/client";
import { pusherClient } from "../pusher";

interface MessagesConnection {
    senderId: string;
    setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
};

export function createMessagesConnection(messagesConnection: MessagesConnection) {
    pusherClient.subscribe(`chat-${messagesConnection.senderId}__new-message`);
      pusherClient.bind('new-message', (data: {
        senderId: string,
        receiverId: string,
        content: string,
        createdAt: string
      }) => {
        messagesConnection.setMessages(prev => [...prev, {
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          createdAt: new Date(data.createdAt)
        }]);
      });

      return () => {
        pusherClient.unsubscribe(`chat-${messagesConnection.senderId}__new-message`);
        pusherClient.unbind('new-message');
      };
}