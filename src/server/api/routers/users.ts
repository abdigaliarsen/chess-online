import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const usersRouter = createTRPCRouter({
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({ where: { id: input.id } });
            return user;
        }),
    updateCity: publicProcedure
        .input(z.object({ id: z.string(), city: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.update({
                where: { id: input.id },
                data: { city: input.city },
            });
            return user;
        }),
    updateCountry: publicProcedure
        .input(z.object({ id: z.string(), country: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.update({
                where: { id: input.id },
                data: { country: input.country },
            });
            return user;
        }),
    updateDescription: publicProcedure
        .input(z.object({ id: z.string(), description: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.update({
                where: { id: input.id },
                data: { description: input.description },
            });
            return user;
        }),
});