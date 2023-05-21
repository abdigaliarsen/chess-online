import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { followsRouter } from "./routers/follows";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: usersRouter,
  follow: followsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
