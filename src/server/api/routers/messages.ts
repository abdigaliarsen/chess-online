import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { pusherServer } from "~/features/pusher";
import { Messages } from "@prisma/client";

export const messagesRouter = createTRPCRouter({
    getMessages: publicProcedure
        .input(z.object({ senderId: z.string(), receiverId: z.string() }))
        .query(async ({ ctx, input }) => {
            const messages = await ctx.prisma.messages.findMany({
                where: {
                    OR: [
                        { senderId: input.senderId, receiverId: input.receiverId },
                        { senderId: input.receiverId, receiverId: input.senderId }
                    ]
                },
                orderBy: { createdAt: "asc" },
                take: 50
            });

            return messages;
        }),
    getAllMessages: publicProcedure
        .input(z.object({ senderId: z.string() }))
        .query(async ({ ctx, input }) => {
            const messages = await ctx.prisma.messages.findMany({
                where: {
                    OR: [
                        { senderId: input.senderId },
                        { receiverId: input.senderId }
                    ]
                },
                orderBy: { createdAt: "asc" }
            });

            let usersMessages: { [senderId: string]: Messages[] } = {};
            messages.forEach(message => {
                if (message.senderId === input.senderId) {
                    usersMessages[message.receiverId] = [...(usersMessages[message.receiverId] || []), message];
                } else {
                    usersMessages[message.senderId] = [...(usersMessages[message.senderId] || []), message];
                }
            });

            return usersMessages;
        }),
    sendMessage: publicProcedure
        .input(z.object({ senderId: z.string(), receiverId: z.string(), content: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const newMessage = {
                senderId: input.senderId,
                receiverId: input.receiverId,
                content: input.content,
                createdAt: new Date().toISOString()
            }

            await pusherServer.trigger(`chat-${input.receiverId}__new-message`,
                'new-message',
                newMessage
            );

            const message = await ctx.prisma.messages.create({
                data: newMessage
            });

            return message;
        }),
});