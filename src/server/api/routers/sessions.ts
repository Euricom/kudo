import { env } from "~/env.mjs";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";


type session = {
    id: string,
    Title: string,
    Date: string,
    SpeakerId: string,
}
type result = {
    sessions: session[]
}
const inputGetById = object({
    id: string(),
})

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()) as result
        return result.sessions
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await fetch(`${env.SESSION_URL}`).then(result => result.json()).then((result: result) => result.sessions.find(r => r.id.toString() === input.id)) as session
    }),
});
