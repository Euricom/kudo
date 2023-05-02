import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { sessionRouter } from "~/server/api/routers/sessions";
import { kudoRouter } from "./routers/kudos";
import { userRouter } from "./routers/users";
import { notificationRouter } from "./routers/notifications";
import { templateRouter } from "./routers/template";
import { slackRouter } from "./routers/slack";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  sessions: sessionRouter,
  kudos: kudoRouter,
  users: userRouter,
  notifications: notificationRouter,
  templates: templateRouter,
  slack: slackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
