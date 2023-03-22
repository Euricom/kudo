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

    //Nog aanpassen met sprekerId
    getSessionsBySpeaker: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as SessionArray
        //dit zal het moeten worden
        // getSessionsBySpeaker: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        // return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: result) => result.sessions.filter((r: session) => r.speakerId === input.id)) as result
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: SessionArray) => result.sessions.find(r => r.id.toString() === input.id)) as Session
    }),
});
