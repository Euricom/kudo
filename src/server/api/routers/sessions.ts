import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { object, string } from "zod";
import {
  getAllSessions,
  getSessionById,
  getSessionsBySpeaker,
} from "~/server/services/sessionService";

const inputGetById = object({
  id: string(),
});

export const sessionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return getAllSessions();
  }),

  getSessionsBySpeaker: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      return getSessionsBySpeaker(input.id);
    }),

  getSessionById: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      return getSessionById(input.id);
    }),
});
