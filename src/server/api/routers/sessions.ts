import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { object, string } from "zod";
import { type Session, type SessionArray } from "~/types";

const inputGetById = object({
  id: string(),
});

export const sessionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const result = (await fetch(`${env.SESSION_URL}`).then((result) =>
      result.json()
    )) as SessionArray;
    return result.sessions;
  }),

  getSessionsBySpeaker: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      return await fetch(`${env.SESSION_URL}`)
        .then((result) => result.json())
        .then((result: SessionArray) =>
          result.sessions.filter((r: Session) => r.speakerId === input.id)
        );
    }),

  getSessionById: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      console.log("getSessionById");
      console.log(input.id);
      return (await fetch(`${env.SESSION_URL}`)
        .then((result) => result.json())
        .then((result: SessionArray) =>
          result.sessions.find((r) => r.id.toString() === input.id)
        )) as Session;
    }),
});
