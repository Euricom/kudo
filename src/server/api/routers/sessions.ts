import { env } from "~/env.mjs";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";


type session = {
    Id: number,
    Title: string,
    Date: string,
    SpeakerId: string,
}
type result = {
    sessions: session[]
}

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch(`${env.SESSION_URL}`).then(result => result.json()) as result
    })
});
