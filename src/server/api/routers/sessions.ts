import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { type Session, type SessionArray } from "~/types";


const inputGetById = object({
    id: string(),
})

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as SessionArray
    }),

    getSessionsBySpeaker: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: SessionArray) => result.sessions.filter((r: Session) => r.speakerId === input.id))
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: SessionArray) => result.sessions.find(r => r.id.toString() === input.id)) as Session
    }),
});
