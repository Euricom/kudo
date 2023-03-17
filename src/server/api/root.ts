import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { sessionRouter } from "~/server/api/routers/sessions";
import { kudoRouter } from "./routers/kudos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  sessions: sessionRouter,
  kudos: kudoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
