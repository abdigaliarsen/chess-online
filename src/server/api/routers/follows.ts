import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { getServerSession } from "next-auth";

export const followsRouter = createTRPCRouter({
    setFollow: publicProcedure
        .input(z.object({ followerId: z.string(), followingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const follow = await ctx.prisma.follows.create({
                data: {
                    followerId: input.followerId,
                    followingId: input.followingId
                }
            });

            return follow;
        }
        ),
    setUnfollow: publicProcedure
        .input(z.object({ followerId: z.string(), followingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const follow = await ctx.prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: input.followerId,
                        followingId: input.followingId
                    }
                }
            });

            return follow;
        }
        ),
});