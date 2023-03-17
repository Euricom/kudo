import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";

type session = {
    id: number,
    title: string,
    date: string,
    speakerId: string,
}

type result = {
    sessions: session[]
}
const inputGetById = object({
    id: string(),
})

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as result
    }),

    //Nog aanpassen met sprekerId
    getSessionsBySpeaker: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as result
        //dit zal het moeten worden
        // getSessionsBySpeaker: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        // return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: result) => result.sessions.filter((r: session) => r.speakerId === input.id)) as result
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()).then((result: result) => result.sessions.find(r => r.id.toString() === input.id)) as session
    }),
});
